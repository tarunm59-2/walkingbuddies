// Service for integrating with crimegrade.org and other crime data sources

export interface CrimeGradeData {
  zipcode: string;
  grade: "A+" | "A" | "B" | "C" | "D" | "F";
  crimeScore: number;
  violentCrime: number;
  propertyCrime: number;
  totalCrime: number;
  population: number;
  area: string;
  state: string;
  city: string;
}

export interface GeofenceZone {
  zipcode: string;
  area: string;
  grade: CrimeGradeData["grade"];
  crimeRate: number;
  lat: number;
  lng: number;
  radius: number;
  lastUpdated: Date;
}

class CrimeDataService {
  private cache = new Map<string, CrimeGradeData>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get crime data for a specific zipcode
   * In production, this would call crimegrade.org API
   */
  async getCrimeDataByZipcode(zipcode: string): Promise<CrimeGradeData | null> {
    // Check cache first
    if (this.isCacheValid(zipcode)) {
      return this.cache.get(zipcode) || null;
    }

    try {
      // For now, using mock data that simulates crimegrade.org structure
      const mockData = this.getMockCrimeData(zipcode);

      if (mockData) {
        this.cache.set(zipcode, mockData);
        this.cacheExpiry.set(zipcode, Date.now() + this.CACHE_DURATION);
        return mockData;
      }

      // In production, you would make an API call like:
      // const response = await fetch(`https://api.crimegrade.org/zipcode/${zipcode}`, {
      //   headers: {
      //     'Authorization': `Bearer ${process.env.CRIMEGRADE_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`Crime data API error: ${response.status}`);
      // }
      //
      // const data = await response.json();
      // return this.normalizeCrimeData(data);

      return null;
    } catch (error) {
      console.error(
        `Failed to fetch crime data for zipcode ${zipcode}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Get crime data for multiple zipcodes
   */
  async getCrimeDataBatch(zipcodes: string[]): Promise<CrimeGradeData[]> {
    const results = await Promise.allSettled(
      zipcodes.map((zipcode) => this.getCrimeDataByZipcode(zipcode)),
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<CrimeGradeData> =>
          result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);
  }

  /**
   * Convert zipcode to approximate lat/lng coordinates
   * In production, use a proper geocoding service
   */
  async getCoordinatesForZipcode(
    zipcode: string,
  ): Promise<{ lat: number; lng: number } | null> {
    const mockCoordinates: Record<string, { lat: number; lng: number }> = {
      "10001": { lat: 40.7505, lng: -73.9934 }, // Chelsea
      "10002": { lat: 40.7209, lng: -73.9896 }, // Lower East Side
      "10003": { lat: 40.7316, lng: -73.9938 }, // Greenwich Village
      "10004": { lat: 40.7041, lng: -74.0125 }, // Financial District
      "10009": { lat: 40.726, lng: -73.9816 }, // East Village
      "10010": { lat: 40.7388, lng: -73.9842 }, // Flatiron
      "10011": { lat: 40.7404, lng: -74.0014 }, // Chelsea
      "10012": { lat: 40.7251, lng: -74.0036 }, // SoHo
      "10013": { lat: 40.7195, lng: -74.0067 }, // Tribeca
      "10014": { lat: 40.7342, lng: -74.0071 }, // West Village
      // Add more NYC zipcodes as needed
    };

    return mockCoordinates[zipcode] || null;

    // In production, use Google Geocoding API:
    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${GOOGLE_MAPS_API_KEY}`
    // );
    // const data = await response.json();
    // if (data.results && data.results.length > 0) {
    //   const location = data.results[0].geometry.location;
    //   return { lat: location.lat, lng: location.lng };
    // }
    // return null;
  }

  /**
   * Create geofence zones from crime data
   */
  async createGeofenceZones(zipcodes: string[]): Promise<GeofenceZone[]> {
    const zones: GeofenceZone[] = [];

    for (const zipcode of zipcodes) {
      const [crimeData, coordinates] = await Promise.all([
        this.getCrimeDataByZipcode(zipcode),
        this.getCoordinatesForZipcode(zipcode),
      ]);

      if (crimeData && coordinates) {
        const radius = this.calculateGeofenceRadius(crimeData.grade);

        zones.push({
          zipcode: crimeData.zipcode,
          area: crimeData.area,
          grade: crimeData.grade,
          crimeRate: (crimeData.totalCrime / crimeData.population) * 1000,
          lat: coordinates.lat,
          lng: coordinates.lng,
          radius,
          lastUpdated: new Date(),
        });
      }
    }

    return zones;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(zipcode: string): boolean {
    const expiry = this.cacheExpiry.get(zipcode);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * Calculate geofence radius based on crime grade
   */
  private calculateGeofenceRadius(grade: CrimeGradeData["grade"]): number {
    const radiusMap: Record<CrimeGradeData["grade"], number> = {
      "A+": 200, // Smaller radius for very safe areas
      A: 300,
      B: 400,
      C: 500, // Larger radius for dangerous areas
      D: 600,
      F: 800,
    };

    return radiusMap[grade] || 400;
  }

  /**
   * Mock crime data that simulates crimegrade.org structure
   * In production, this would be replaced with actual API calls
   */
  private getMockCrimeData(zipcode: string): CrimeGradeData | null {
    const mockData: Record<string, CrimeGradeData> = {
      "10001": {
        zipcode: "10001",
        grade: "B",
        crimeScore: 12.3,
        violentCrime: 156,
        propertyCrime: 890,
        totalCrime: 1046,
        population: 85000,
        area: "Chelsea",
        state: "NY",
        city: "New York",
      },
      "10002": {
        zipcode: "10002",
        grade: "C",
        crimeScore: 18.7,
        violentCrime: 234,
        propertyCrime: 1156,
        totalCrime: 1390,
        population: 74000,
        area: "Lower East Side",
        state: "NY",
        city: "New York",
      },
      "10003": {
        zipcode: "10003",
        grade: "A",
        crimeScore: 8.2,
        violentCrime: 89,
        propertyCrime: 445,
        totalCrime: 534,
        population: 65000,
        area: "Greenwich Village",
        state: "NY",
        city: "New York",
      },
      "10004": {
        zipcode: "10004",
        grade: "A+",
        crimeScore: 4.1,
        violentCrime: 23,
        propertyCrime: 167,
        totalCrime: 190,
        population: 46000,
        area: "Financial District",
        state: "NY",
        city: "New York",
      },
      "10009": {
        zipcode: "10009",
        grade: "C",
        crimeScore: 19.4,
        violentCrime: 278,
        propertyCrime: 1234,
        totalCrime: 1512,
        population: 78000,
        area: "East Village",
        state: "NY",
        city: "New York",
      },
    };

    return mockData[zipcode] || null;
  }

  /**
   * Normalize crime data from different API sources
   */
  private normalizeCrimeData(rawData: any): CrimeGradeData {
    // This would handle different API response formats
    return {
      zipcode: rawData.zipcode || rawData.zip,
      grade: rawData.grade || this.calculateGradeFromScore(rawData.crimeScore),
      crimeScore: rawData.crimeScore || rawData.crime_score,
      violentCrime: rawData.violentCrime || rawData.violent_crime,
      propertyCrime: rawData.propertyCrime || rawData.property_crime,
      totalCrime: rawData.totalCrime || rawData.total_crime,
      population: rawData.population,
      area: rawData.area || rawData.neighborhood,
      state: rawData.state,
      city: rawData.city,
    };
  }

  /**
   * Calculate letter grade from numeric crime score
   */
  private calculateGradeFromScore(score: number): CrimeGradeData["grade"] {
    if (score <= 5) return "A+";
    if (score <= 8) return "A";
    if (score <= 12) return "B";
    if (score <= 18) return "C";
    if (score <= 25) return "D";
    return "F";
  }
}

export const crimeDataService = new CrimeDataService();
