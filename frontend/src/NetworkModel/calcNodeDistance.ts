import {Node} from "./network";

/**
 * Calculate the distance in kilometers between two nodes using the Haversine formula
 * @param nodeA
 * @param nodeB
 */
export const calcNodeDistance = (nodeA: Node, nodeB: Node): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const lat1 = nodeA.latitude;
  const lon1 = nodeA.longitude;
  const lat2 = nodeB.latitude;
  const lon2 = nodeB.longitude;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const toRadians = (degree: number) => degree * (Math.PI / 180);