# backend/app/services/physics_engine.py
# Industry-Grade Physics Calculation Engine for Hydrology, Slope Stability, & Triage
import math
from typing import Dict, Any

class PhysicsEngine:
    """
    Mathematical physics engine implementing statutory hydrological and geological equations.
    """

    @staticmethod
    def marshall_palmer_rain_rate(reflectivity_dBZ: float) -> Dict[str, Any]:
        """
        Marshall-Palmer Relationship for Monsoon Clouds: Z = 200 * R^1.6
        Converts Doppler radar reflectivity Z (dBZ) into rain intensity R (mm/hr).
        """
        if reflectivity_dBZ <= 0:
            rain_rate = 0.0
        else:
            z_factor = 10.0 ** (reflectivity_dBZ / 10.0)  # Z in mm^6/m^3
            rain_rate = (z_factor / 200.0) ** (1.0 / 1.6)
            
        rain_rate = round(rain_rate, 2)
        warning_level = "GREEN_NORMAL"
        if rain_rate >= 45.0:
            warning_level = "RED_EXTREME_HEAVY"
        elif rain_rate >= 25.0:
            warning_level = "ORANGE_HEAVY"
        elif rain_rate >= 10.0:
            warning_level = "YELLOW_MODERATE"

        return {
            "reflectivity_dBZ": reflectivity_dBZ,
            "rain_rate_mm_hr": rain_rate,
            "warning_level": warning_level,
            "formula": "R = (10^(dBZ/10) / 200)^(1/1.6)"
        }

    @staticmethod
    def infinite_slope_factor_of_safety(
        cohesion_kPa: float = 12.0,          # Effective cohesion c'
        soil_unit_weight: float = 19.5,      # gamma (kN/m^3)
        water_unit_weight: float = 9.81,     # gamma_w (kN/m^3)
        soil_depth_m: float = 3.5,           # z (m)
        slope_angle_deg: float = 38.5,       # beta
        friction_angle_deg: float = 28.0,    # phi'
        water_table_ratio: float = 0.88      # m = zw / z (soil saturation ratio)
    ) -> Dict[str, Any]:
        """
        Infinite Slope Stability Factor of Safety (FS):
        FS = [c' + (gamma - m * gamma_w) * z * cos^2(beta) * tan(phi')] / [gamma * z * sin(beta) * cos(beta)]
        
        FS < 1.0 indicates IMPENDING SLOPE FAILURE / LANDSLIDE.
        """
        beta = math.radians(slope_angle_deg)
        phi = math.radians(friction_angle_deg)
        
        cos_beta = math.cos(beta)
        sin_beta = math.sin(beta)
        
        numerator = cohesion_kPa + (soil_unit_weight - water_table_ratio * water_unit_weight) * soil_depth_m * (cos_beta ** 2) * math.tan(phi)
        denominator = soil_unit_weight * soil_depth_m * sin_beta * cos_beta
        
        fs = numerator / denominator if denominator != 0 else 1.0
        fs = round(fs, 3)
        
        # Hazard Index = 1 - min(FS / 2.0, 1.0)
        hazard_index = round(max(0.0, min(1.0 - (fs / 2.0) + 0.2, 1.0)), 2)
        
        return {
            "factor_of_safety_FS": fs,
            "landslide_hazard_index": hazard_index,
            "status": "CRITICAL_SLOPE_FAILURE" if fs < 1.1 else "STABLE",
            "slope_angle_deg": slope_angle_deg,
            "soil_saturation_pct": round(water_table_ratio * 100, 1),
            "formula": "FS = [c' + (gamma - m*gamma_w)*z*cos^2(beta)*tan(phi')] / [gamma*z*sin(beta)*cos(beta)]"
        }

    @staticmethod
    def manning_channel_velocity(
        manning_n: float = 0.035,           # Channel roughness n (natural riverbed)
        hydraulic_radius_m: float = 4.2,    # Rh (m)
        slope_gradient: float = 0.0025       # S (m/m)
    ) -> Dict[str, Any]:
        """
        Manning's Equation for Open Channel River Flow Velocity: V = (1/n) * Rh^(2/3) * S^(1/2)
        """
        velocity = (1.0 / manning_n) * (hydraulic_radius_m ** (2.0 / 3.0)) * (slope_gradient ** 0.5)
        velocity = round(velocity, 2)
        
        return {
            "flow_velocity_m_s": velocity,
            "flow_velocity_km_h": round(velocity * 3.6, 2),
            "hydraulic_radius_m": hydraulic_radius_m,
            "formula": "V = (1/n) * Rh^(2/3) * S^(1/2)"
        }

physics_engine = PhysicsEngine()
