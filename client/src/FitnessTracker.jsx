import React, { useEffect, useState } from "react";

const EARTH_RADIUS_KM = 6371;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}

export default function FitnessTracker() {
    const [distance, setDistance] = useState(0);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [motionPermissionRequested, setMotionPermissionRequested] = useState(false);
    let previousCoords = null;

    useEffect(() => {
        if (typeof DeviceMotionEvent !== "undefined" &&
            typeof DeviceMotionEvent.requestPermission === "function" &&
            !motionPermissionRequested) {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === "granted") {
                        setMotionPermissionRequested(true);
                        console.log("Motion permission granted");
                    }
                })
                .catch(console.error);
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                if (previousCoords) {
                    const d = getDistanceFromLatLonInKm(
                        previousCoords.latitude,
                        previousCoords.longitude,
                        latitude,
                        longitude
                    );
                    setDistance((prev) => {
                        const updatedDistance = prev + d;
                        if (updatedDistance >= 1 && !taskCompleted) {
                            setTaskCompleted(true);
                            alert("✅ Task Completed: You've run 1km!");
                        }
                        return updatedDistance;
                    });
                }

                previousCoords = { latitude, longitude };
            },
            (err) => console.error(err),
            { enableHighAccuracy: true, maximumAge: 1000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [taskCompleted, motionPermissionRequested]);

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md space-y-4">
            <h2 className="text-2xl font-bold">🏃‍♂️ Fitness Tracker</h2>
            <p className="text-lg">Distance: {distance.toFixed(12)} km</p>
            {taskCompleted ? (
                <p className="text-green-600 font-semibold">Task Completed!</p>
            ) : (
                <p className="text-gray-500">Keep going to reach 1 km...</p>
            )}
        </div>
    );
}