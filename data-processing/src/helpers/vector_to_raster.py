"""
Module for converting vector files (shapefiles) to raster format using GDAL.
"""

import subprocess
from pathlib import Path
from typing import Union, Optional, List

import rasterio
from rich.console import Console

console = Console()


def convert_vector_to_raster(
    vector_path: Union[str, Path],
    output_path: Union[str, Path],
    field_name: str = "code",
    reference_raster: Optional[Union[str, Path]] = None,
    pixel_size: float = 30,
    match_extent: bool = False,
    nodata_value: int = 0,
    data_type: str = "Int16"
) -> Path:
    """
    Convert vector to raster using GDAL.
    
    Args:
        vector_path: Path to input vector file
        output_path: Path to output raster
        field_name: Field to use for raster values
        reference_raster: Optional reference raster to match properties
        pixel_size: Pixel size (ignored if reference_raster provided)
        match_extent: Match exact extent of reference raster
        nodata_value: NoData value
        data_type: Output data type
        
    Returns:
        Path to created raster file
    """
    vector_path = Path(vector_path)
    output_path = Path(output_path)
    
    # Validate inputs
    if not vector_path.exists():
        raise FileNotFoundError(f"Vector file not found: {vector_path}")
    
    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    console.print(f"🔄 Converting {vector_path.name} to raster...", style="blue")
    
    # Build command
    cmd = ["gdal_rasterize", "-a", field_name, "-a_nodata", str(nodata_value), "-ot", data_type]
    
    if reference_raster:
        reference_raster = Path(reference_raster)
        if not reference_raster.exists():
            raise FileNotFoundError(f"Reference raster not found: {reference_raster}")
            
        # Get all reference properties in one read
        with rasterio.open(reference_raster) as ref:
            pixel_size_x = ref.transform[0]
            pixel_size_y = abs(ref.transform[4])
            crs = ref.crs.to_string()
            bounds = ref.bounds
            width = ref.width
            height = ref.height
            
        console.print(f"📏 Using pixel size: {pixel_size_x} x {pixel_size_y}", style="cyan")
        console.print(f"🌍 Using CRS: {crs}", style="cyan")
        
        if match_extent:
            console.print(f"📦 Matching exact extent: {width}x{height} pixels", style="cyan")
            cmd.extend([
                "-te", str(bounds.left), str(bounds.bottom), str(bounds.right), str(bounds.top),
                "-ts", str(width), str(height),
                "-a_srs", crs
            ])
        else:
            cmd.extend([
                "-tr", str(pixel_size_x), str(pixel_size_y),
                "-a_srs", crs
            ])
    else:
        cmd.extend([
            "-tr", str(pixel_size), str(pixel_size),
            "-te_from_extent", str(vector_path)
        ])
    
    # Add input and output
    cmd.extend([str(vector_path), str(output_path)])
    
    # Execute command
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        console.print(f"✅ Raster created: {output_path.name}", style="green")
        return output_path
    except subprocess.CalledProcessError as e:
        console.print(f"❌ GDAL error: {e.stderr}", style="red")
        raise


def batch_convert_vectors(
    vector_files: List[Union[str, Path]],
    output_folder: Union[str, Path],
    field_name: str = "code",
    **kwargs
) -> List[Path]:
    """
    Convert multiple vector files to rasters.
    
    Args:
        vector_files: List of vector file paths
        output_folder: Output folder for rasters
        field_name: Field to use for raster values
        **kwargs: Arguments passed to convert_vector_to_raster
        
    Returns:
        List of created raster file paths
    """
    output_folder = Path(output_folder)
    output_folder.mkdir(parents=True, exist_ok=True)
    
    return [
        convert_vector_to_raster(
            Path(vector_file), 
            output_folder / f"{Path(vector_file).stem}.tif", 
            field_name, 
            **kwargs
        )
        for vector_file in vector_files
    ]