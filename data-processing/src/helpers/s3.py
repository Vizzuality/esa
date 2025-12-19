"""Module for managing S3 uploads and deletions."""

import glob
import os

import boto3
from botocore.exceptions import NoCredentialsError
from rich.console import Console
from rich.progress import (
    BarColumn,
    Progress,
    SpinnerColumn,
    TextColumn,
    TimeElapsedColumn,
)

console = Console()


def _get_s3_client(environment="staging"):
    """Get configured S3 client."""
    session = boto3.session.Session()
    if environment == "staging":
        return session.client(
            "s3",
            endpoint_url=os.getenv("ENDPOINT_URL"),
            aws_access_key_id=os.getenv("KEY_ID"),
            aws_secret_access_key=os.getenv("SECRET_KEY"),
        )
    elif environment == "production":
        return session.client(
            "s3",
            endpoint_url=os.getenv("NEW_AWS_ENDPOINT_URL"),
            aws_access_key_id=os.getenv("NEW_AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("NEW_AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("NEW_AWS_DEFAULT_REGION"),
        )
    else:
        raise ValueError("Invalid environment specified for S3 client.")


def _get_bucket_name(environment="staging"):
    """Get S3 bucket name from environment."""
    if environment == "staging":
        return os.getenv("BUCKET_NAME")
    elif environment == "production":
        return os.getenv("NEW_AWS_BUCKET_NAME")
    else:
        raise ValueError("Invalid environment specified for S3 bucket name.")


def upload_local_directory_to_s3(local_path, destination_blob_path, environment="staging"):
    """Uploads a directory to the bucket.
    Args:
        local_path (str): Local path to the directory to upload.
        destination_blob_path (str): S3 path where the directory will be uploaded.
    """
    console.print(
        f"🚀 [bold white]Uploading directory to S3 From:[cyan]\
            {local_path}\nTo: {destination_blob_path}"
    )

    s3_client = _get_s3_client(environment)
    bucket_name = _get_bucket_name(environment)

    rel_paths = glob.glob(local_path + "/**", recursive=True)
    files_to_upload = [f for f in rel_paths if os.path.isfile(f)]

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        TimeElapsedColumn(),
        console=console,
    ) as progress:
        upload_task = progress.add_task(
            f"Uploading {len(files_to_upload)} files...", total=len(files_to_upload)
        )

        for local_file in rel_paths:
            # Get the relative path from the local_file
            relative_path = os.path.relpath(local_file, local_path)

            # Construct the remote_path
            remote_path = os.path.join(destination_blob_path, relative_path)
            if os.path.isfile(local_file):
                try:
                    # Update progress description with current file
                    path_parts = relative_path.split(os.sep)
                    if len(path_parts) >= 3:
                        tile_path = "/".join(
                            path_parts[-3:]
                        )  # Get last 3 parts: z/x/y.png
                    else:
                        tile_path = relative_path
                    progress.update(upload_task, description=f"Uploading: {tile_path}")

                    with open(local_file, "rb") as data:
                        s3_client.put_object(
                            Bucket=bucket_name,
                            Key=remote_path,
                            Body=data,
                            # ACL="public-read",
                        )
                    progress.advance(upload_task)
                except NoCredentialsError:
                    console.print("[red]✗ No AWS credentials found[/red]")
                    return

    console.print(
        f"[bold green]✅ Successfully uploaded {len(files_to_upload)} files![/bold green]"
    )


def delete_s3_folder(folder_path, environment="staging"):
    """Deletes an entire folder (prefix) from the S3 bucket.
    Args:
        folder_path (str): S3 path of the folder to delete.
    """
    console.print(f"🚀 [bold white]Deleting S3 folder: [cyan] {folder_path}")

    s3_client = _get_s3_client(environment)
    bucket_name = _get_bucket_name(environment)

    try:
        # Ensure folder_path ends with '/' to match folder structure
        if not folder_path.endswith("/"):
            folder_path += "/"

        console.print(
            f"[yellow]🔍 Scanning for objects in folder: {folder_path}[/yellow]"
        )

        # List all objects with the folder prefix
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=folder_path)

        if "Contents" not in response:
            console.print(
                f"[orange3]⚠️  No objects found in folder: {folder_path}[/orange3]"
            )
            return

        # Collect all object keys to delete
        objects_to_delete = [{"Key": obj["Key"]} for obj in response["Contents"]]
        total_objects = len(objects_to_delete)

        console.print(f"[yellow]📋 Found {total_objects} objects to delete[/yellow]")

        # Delete objects in batches (S3 allows up to 1000 objects per delete request)
        batch_size = 1000
        deleted_count = 0

        for i in range(0, len(objects_to_delete), batch_size):
            batch = objects_to_delete[i : i + batch_size]

            delete_response = s3_client.delete_objects(
                Bucket=bucket_name, Delete={"Objects": batch}
            )

            # Process deleted objects
            if "Deleted" in delete_response:
                deleted_count += len(delete_response["Deleted"])

            # Process any errors
            if "Errors" in delete_response:
                for error in delete_response["Errors"]:
                    console.print(
                        (
                            f"[red]✗ Error deleting {error['Key']}: {error['Code']} - "
                            f"{error['Message']}[/red]"
                        )
                    )

        console.print(
            f"[bold green]🗑️  Successfully deleted {deleted_count}/{total_objects} "
            f"objects from folder: {folder_path}[/bold green]"
        )

    except NoCredentialsError:
        console.print("[red]✗ No AWS credentials found[/red]")
    except Exception as e:
        console.print(f"[red]✗ Error deleting folder {folder_path}: {str(e)}[/red]")


def migrate_s3_folder(folder_path, dry_run=False):
    """Migrates files from staging bucket to production bucket.

    Args:
        folder_path (str): S3 path of the folder to migrate.
        dry_run (bool): If True, only list files without copying. Default is False.
    """
    console.print(
        f"🚀 [bold white]Migrating S3 folder from staging to production: [cyan]{folder_path}"
    )

    staging_client = _get_s3_client("staging")
    production_client = _get_s3_client("production")
    staging_bucket = _get_bucket_name("staging")
    production_bucket = _get_bucket_name("production")

    try:
        # Ensure folder_path ends with '/' to match folder structure
        if not folder_path.endswith("/"):
            folder_path += "/"

        console.print(f"[yellow]🔍 Scanning staging bucket for objects in: {folder_path}[/yellow]")

        # List all objects with the folder prefix in staging
        response = staging_client.list_objects_v2(Bucket=staging_bucket, Prefix=folder_path)

        if "Contents" not in response:
            console.print(
                f"[orange3]⚠️  No objects found in staging folder: {folder_path}[/orange3]"
            )
            return

        files_to_migrate = response["Contents"]
        total_files = len(files_to_migrate)

        console.print(f"[yellow]📋 Found {total_files} files to migrate[/yellow]")

        if dry_run:
            console.print("[cyan]🔍 DRY RUN MODE - No files will be copied[/cyan]")
            for obj in files_to_migrate:
                console.print(f"  - {obj['Key']} ({obj['Size']} bytes)")
            return

        # Migrate files with progress bar
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
            TimeElapsedColumn(),
            console=console,
        ) as progress:
            migrate_task = progress.add_task(f"Migrating {total_files} files...", total=total_files)

            for obj in files_to_migrate:
                key = obj["Key"]

                # Update progress with current file
                file_name = os.path.basename(key)
                progress.update(migrate_task, description=f"Migrating: {file_name}")

                try:
                    # Copy object from staging to production
                    copy_source = {"Bucket": staging_bucket, "Key": key}

                    # Get object metadata to preserve it
                    head_response = staging_client.head_object(Bucket=staging_bucket, Key=key)
                    content_type = head_response.get("ContentType", "application/octet-stream")

                    production_client.copy_object(
                        CopySource=copy_source,
                        Bucket=production_bucket,
                        Key=key,
                        ContentType=content_type,
                        ACL="public-read",
                    )

                    progress.advance(migrate_task)

                except Exception as e:
                    console.print(f"[red]✗ Error migrating {key}: {str(e)}[/red]")
                    continue

        console.print(
            (
                f"[bold green]✅ Successfully migrated {total_files} files from staging "
                f"to production![/bold green]"
            )
        )
        console.print(f"[cyan]📍 Source: s3://{staging_bucket}/{folder_path}[/cyan]")
        console.print(f"[cyan]📍 Destination: s3://{production_bucket}/{folder_path}[/cyan]")

    except NoCredentialsError:
        console.print("[red]✗ No AWS credentials found[/red]")
    except Exception as e:
        console.print(f"[red]✗ Error migrating folder {folder_path}: {str(e)}[/red]")
