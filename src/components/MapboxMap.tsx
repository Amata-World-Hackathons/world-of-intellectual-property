import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import mapbox from "mapbox-gl";
import classnames from "classnames";
// import { useRouter } from "next/router";

mapbox.accessToken =
  "pk.eyJ1IjoiYW1hdGFoYWNrc25qYW1zIiwiYSI6ImNsMjA1dXp4ZzB0Ym0zZG1xZHcwNDdnMTMifQ.3O57cRVj9gcbqGRbQwAbMw";

export interface MapboxMapProps extends React.HTMLAttributes<HTMLDivElement> {
  test?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ children, className }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapbox.Map | null>(null);
  const [center, setCenter] = useState<[number, number]>([
    -0.1440787, 51.501364,
  ]);
  const [zoom, setZoom] = useState(16);
  const [loading, setLoading] = useState(true);
  //   const router = useRouter();

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return; // initialize map only once

    const map = new mapbox.Map({
      container: mapContainer.current!,
      // style: "mapbox://styles/amatahacksnjams/cl0p3l629000d15s8e4ekv0uj",
      style: "mapbox://styles/amatahacksnjams/cl0rayyhv00c214n2ngjn40ri",
      center,
      zoom: zoom,
      minZoom: 0,
    });

    // map.on("move", () => {
    //   const lat = map.getCenter().lat;
    //   const lng = map.getCenter().lng;
    //   setCenter([lng, lat]);
    //   setZoom(map.getZoom());
    // });

    mapRef.current = map;

    map.on("load", () => {
      setLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContainer.current]);

  return (
    <div ref={mapContainer} className={classnames(className, "relative")}>
      {children}
    </div>
  );
};

export default MapboxMap;
