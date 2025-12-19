ESA-GDA
==============================

GDA – Global Development Assistance – is a global partnership to mainstream the use of Earth observation into development operations.

--------

# Setup

## The environment

To run the notebooks you need to create an environment with the dependencies. There are two options:

### Docker

If you have [docker](https://docs.docker.com/engine/install/) in your system,
you run a jupyter lab server with:

``` bash
docker compose up --build
```

And if you want to get into the container, use a terminal in jupyter lab,
vscode remote development or run this command:

```shell
docker exec -it esa_gda_notebooks /bin/bash
```
#### Conda environment

Create the environment with:

``` bash
mamba env create -n esa_gda -f environment.yml
```

This will create an environment called south_sudan_pilot_gmv with a common set of dependencies.

To install the **pre-commit hooks**, with the environment activated and in the project root directory, run:

``` bash
pre-commit install
```

To install the package in editable mode, run:
```
pip install -e .
```

#### Update the environment

If you need to update the environment installing a new package, you simply do it with:

``` bash
mamba install [package]  # or `pip install [package]` if you want to install it via pip
```

then update the environment.yml file so others can clone your environment with:

``` bash
mamba env export --no-builds -f environment.yml
```

### Environment variables

The environment variables are stored in a `.env` file. You can copy the `.env.example` file and fill in the values:

``` bash
cp .env.example .env
```
