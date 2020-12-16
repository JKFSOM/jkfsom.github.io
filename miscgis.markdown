---
layout: page
title: Misc. GIS
permalink: /miscgis/
published: true
---
### Sources of GIS data
 Resources useful for GIS applications, such as LiDAR and aerial imagery

#### Earthquakes ([link](https://earthquake.usgs.gov/fdsnws/event/1/))
- USGS earthquake data API

#### UK historic weather data ([link](https://www.ceda.ac.uk/blog/uk-weather-station-records-now-freely-available-to-all-midas-open/))
- Provided by the Centre for Environmental Data Analysis (CEDA) land surface station data from 1853 to present is available to the public.
---
#### River information ([link](https://nrfa.ceh.ac.uk/data/search))
Flow data from stations around the UK. Precipitation and catchment data made available, also.

---
#### UK LiDAR data ([link](https://environment.data.gov.uk/DefraDataDownload/?Mode=survey))
- Provided by DeFRA, with incomplete coverage and a range of resolutions depending on area. Updated ~once a year.
---
#### UK Freehold Property Information ([link](https://use-land-property-data.service.gov.uk/datasets/inspire/download))
- Provided by the Land Registry UK as a .gml polygon
---
#### Misc. datasets
Although not datasets in themselves, the following are great resources to check when looking for datasets

- [Kaggle](https://www.kaggle.com/datasets)
- [Google Dataset Search](https://toolbox.google.com/datasetsearch)
- [UK Gov.](https://data.gov.uk/)
- [Agrimetrics](https://app.agrimetrics.co.uk/catalog/data-sets)
- [Radiant ML Hub](http://registry.mlhub.earth/)

## An overview of useful Python tools for handling GIS files, etc.
##### A brief breakdown on how to use a selection of Python libraries for pre- and post- processing, as well as installation procedure. The most important thing to recognise is that the libraries are largely a mess, and are best run in virtual envs. to prevent a conflict in dependencies.

---
 #### Geopandas ([link](https://geopandas.org/gallery/index.html))

Geopandas extends the datatypes used by Pandas to allow spatial operations on geometric types (performed by Shapely). Often requires the creation of a "geodataframe" (within Geopandas).

##### Examples possibilities
- Plotting geojson as a map
- Clipping vector (map) data
- Adding backgrounds of map plots
---
#### Rasterio ([link](https://github.com/mapbox/rasterio))

Rasterio is use to read and write raster databases (based on N-dimensional arrays)

##### Example possibilities
- Read in a raster, average all of the bands, and produce another raster as output
---
#### Supermercado (Mercantile++) ([link]())

Supermercado is an add-on/upgrade to Mercantile which allows you to work with coordinate systems. Although it can be used from Python, it is best to call it from a terminal shell (or via os.exec()).

```!pip install git+https://github.com/mapbox/supermercado.git```

##### Example possibilities
- Stream a GeoJSON file, along with a stream of co-ordinates, and it will return a stream of co-ordinates where the two streams intersect (burn)
- Stream a GeoJSON file, along with the "mercantile shapes" parameter, and have returned a grid of squares over the area of interest - useful for dividing a file up for training (burn)
- Output a stream of tiles around the edge of some input co-ordinate stream (edge)
- Get an entire area in the style of the "mercantile shapes" option above, but feed back as one large shape rather than individual tiles
- Convert tiles back into a GeoJSON file ([more info.](https://mercantile.readthedocs.io/en/latest/cli.html))
---
#### GDAL ([link](https://gdal.org/tutorials/raster_api_tut.html))

GDAL is a translator library for raster and vector geospatial formats. 

##### Example possibilities
- Reading, writing, raster data (including bands)
- Reprojecting raster and vector data

##### Installation
- This [guide](https://mothergeo-py.readthedocs.io/en/latest/development/how-to/gdal-ubuntu-pkg.html) (or [archived](https://web.archive.org/web/20200828094712/https://mothergeo-py.readthedocs.io/en/latest/development/how-to/gdal-ubuntu-pkg.html)) provides the best outline for installing GDAL on Ubuntu at the time or writing (Aug. 2020).
---
#### Solaris ([link](https://github.com/CosmiQ/solaris))

Solaris is a Geospatial machine learning analysis toolkit.

##### Example possibilities
- Tiling large-format overhead images and vector data
- Convert between geospatial raster and vector formats to ML-compatible formats
- Perform semantic and instance segmentation, and object detection. All models specifically designed for overhead imagery
- Evaluate performance of DL model predictions
- Burn data into rasters, etc.

##### Installation issues
- Currently requires Tensorflow 1.13.1 to install, so have to use Python 3.6 (```virtualenv --python=python3.6 solaris```). Also, heavily dependent on GDAL, so make sure that it is installed before installing Solaris. 

## Other
##### Other useful resources and information

#### Converting a typical raster to a [cloud optimised GeoTiff (COG)](https://www.cogeo.org/)
- Using GDAL from the terminal run ```gdal_translate -ot Byte in.tif out.tif -co TILED=YES -co COPY_SRC_OVERVIEWS=YES -co COMPRESS=LZW```
