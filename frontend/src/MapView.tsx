import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Post } from "./types";
import "mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
type Props = {
    posts: Post[]; //recive it as type Post
    onMapClick: (coords: { lng: number; lat: number }) => void; //return void for now
};
export default function MapView({ posts, onMapClick }: Props) {
    const mapContainer = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;
        console.log(posts);
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [130.4017, 33.5902], // 博多
            zoom: 12
        });
        map.on("click", (e) => { //when click 
            const { lng, lat } = e.lngLat;
            onMapClick({ lng, lat });
        });
        posts.forEach((post) => {
            if (!post.lat || !post.lng) return;

            new mapboxgl.Marker()
                .setLngLat([post.lng, post.lat])
                .setPopup(
                    new mapboxgl.Popup().setHTML(
                        `<h3>${post.title}</h3><p>${post.description}</p>`
                    )
                )
                .addTo(map);
        });

        return () => map.remove();
    }, [posts]);

    return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
}