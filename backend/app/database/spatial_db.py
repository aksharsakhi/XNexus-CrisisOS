# backend/app/database/spatial_db.py
# Spatial GIS Population Intersect Query Engine

class SpatialDatabaseEngine:
    def __init__(self):
        self.census_blocks = [
            {
                "block_id": "WYD-BLK-01",
                "name": "Chooralmala Village Sector B-4",
                "district": "Wayanad",
                "households": 340,
                "population": 1420,
                "vulnerable_seniors_children": 480
            },
            {
                "block_id": "WYD-BLK-02",
                "name": "Mundakkai East Sector",
                "district": "Wayanad",
                "households": 500,
                "population": 2100,
                "vulnerable_seniors_children": 620
            }
        ]

    def query_exposed_population(self, region: str, hazard_type: str = "FLOOD_LANDSLIDE") -> dict:
        """
        Simulates PostGIS ST_Intersects spatial join query between CWC inundation shapefiles
        and Census demographic spatial blocks.
        """
        blocks = [b for b in self.census_blocks if b["district"].lower() in region.lower()]
        if not blocks:
            blocks = self.census_blocks

        total_households = sum(b["households"] for b in blocks)
        total_pop = sum(b["population"] for b in blocks)
        total_vulnerable = sum(b["vulnerable_seniors_children"] for b in blocks)

        return {
            "region": region,
            "hazard_type": hazard_type,
            "intersected_census_blocks": len(blocks),
            "exposed_households": total_households,
            "exposed_population": total_pop,
            "vulnerable_individuals": total_vulnerable,
            "spatial_blocks": blocks
        }

spatial_db = SpatialDatabaseEngine()
