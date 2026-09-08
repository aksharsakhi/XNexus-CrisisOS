# backend/app/services/routing_engine.py
# Dijkstra / A* Emergency Road Graph Routing Engine
import heapq
from typing import List, Dict, Any, Tuple

class EmergencyRoutingEngine:
    def __init__(self):
        # Road graph nodes (Intersections & Toll Plazas)
        self.road_nodes = {
            "A": "Chooralmala Sector Zero",
            "B": "NH-76 Landslide Pass (BLOCKED)",
            "C": "Kalpetta Junction",
            "D": "Route 3 East Elevated Bypass (OPEN)",
            "E": "Route 5 State Highway 12 (OPEN)",
            "F": "Kozhikode District Hospital"
        }
        
        # Weighted road edges (Distance in km, Status)
        self.road_graph = {
            "A": [("B", 12.0, "BLOCKED"), ("D", 14.5, "OPEN"), ("E", 18.0, "OPEN")],
            "B": [("A", 12.0, "BLOCKED"), ("C", 8.0, "BLOCKED")],
            "C": [("B", 8.0, "BLOCKED"), ("D", 6.0, "OPEN"), ("F", 10.0, "OPEN")],
            "D": [("A", 14.5, "OPEN"), ("C", 6.0, "OPEN"), ("F", 16.0, "OPEN")],
            "E": [("A", 18.0, "OPEN"), ("F", 12.0, "OPEN")],
            "F": [("C", 10.0, "OPEN"), ("D", 16.0, "OPEN"), ("E", 12.0, "OPEN")]
        }

    def compute_shortest_open_path(self, start_node: str = "A", end_node: str = "F") -> Dict[str, Any]:
        """
        Dijkstra shortest path algorithm bypassing blocked road segments.
        """
        distances = {node: float('inf') for node in self.road_graph}
        distances[start_node] = 0.0
        previous_nodes = {node: None for node in self.road_graph}
        
        pq = [(0.0, start_node)]
        
        while pq:
            current_dist, current_node = heapq.heappop(pq)
            
            if current_dist > distances[current_node]:
                continue
                
            if current_node == end_node:
                break
                
            for neighbor, weight, status in self.road_graph[current_node]:
                if status == "BLOCKED":
                    continue  # Avoid blocked road segments completely
                    
                distance = current_dist + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous_nodes[neighbor] = current_node
                    heapq.heappush(pq, (distance, neighbor))
                    
        # Reconstruct path
        path = []
        curr = end_node
        while curr is not None:
            path.append(curr)
            curr = previous_nodes[curr]
        path.reverse()
        
        path_names = [self.road_nodes.get(n, n) for n in path]
        
        return {
            "algorithm": "Dijkstra Emergency Pathfinding",
            "start": self.road_nodes[start_node],
            "destination": self.road_nodes[end_node],
            "optimal_distance_km": round(distances[end_node], 1),
            "estimated_eta_minutes": round((distances[end_node] / 45.0) * 60, 1), # 45 km/h avg emergency speed
            "path_nodes": path,
            "path_names": path_names,
            "blocked_roads_bypassed": ["NH-76 (Kalpetta-Chooralmala Pass)"]
        }

routing_engine = EmergencyRoutingEngine()
