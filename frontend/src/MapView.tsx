import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Post } from "./types";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

type Props = {
    posts: Post[];
    onMapClick: (coords: { lng: number; lat: number }) => void;
};

export default function MapView({ posts, onMapClick }: Props) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);


    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [130.4017, 33.5902], // 博多
            zoom: 12
        });

        map.on("click", (e) => {
            const { lng, lat } = e.lngLat;
            onMapClick({ lng, lat });
        });

        mapRef.current = map;


        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);


    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;


        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];


        posts.forEach((post) => {
            if (!post.lat || !post.lng) return;

            const marker = new mapboxgl.Marker()
                .setLngLat([post.lng, post.lat])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<h3>${post.title}</h3><p>${post.description}</p><p>${post.price}円</p>`
                    )
                )
                .addTo(map);


            markersRef.current.push(marker);
        });
    }, [posts]);

    return <div ref={mapContainer} style={{ width: "100%", height: "500px", borderRadius: "8px" }} />;
}