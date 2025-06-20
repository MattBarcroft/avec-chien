import axios from "axios";

const CLIENT_ID = "XXX";
const CLIENT_SECRET = "XXX";
const ACCESS_TOKEN = "XXX";
const CODE = "XXX";
const STRAVA_API_BASE = "https://www.strava.com/api/v3";

const getAthlete = async () => {
  const getRecentActivityIds = async () => {
    console.log("hi");
    try {
      const response = await axios.get(
        `${STRAVA_API_BASE}/athlete/activities?after=1735689600&per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
      return response.data.map((activity) => activity.id);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const filterActivities = async (activityIds) => {
    const dogActivities = [];

    for (const id of activityIds) {
      const response = await axios.get(`${STRAVA_API_BASE}/activities/${id}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      if (response.data.description?.includes("🐾")) {
        dogActivities.push({
          id: response.data.id,
          distance: response.data.distance,
          description: response.data.description,
        });
      }
    }

    return dogActivities;
  };
  const updateDescription = async (id, updatedDescription) => {
    const response = await axios.put(
      `${STRAVA_API_BASE}/activities/${id}`,
      {
        description: updatedDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    console.log(response.data);
  };

  const activityIds = await getRecentActivityIds();
  const dogActivities = await filterActivities(activityIds);

  const totalDistance = (
    dogActivities.reduce((total, activity) => total + activity.distance, 0) /
    1000
  ).toFixed(1);
  const latestActivityId = dogActivities[dogActivities.length - 1].id;
  const latestActivityDescription =
    dogActivities[dogActivities.length - 1].description;

  const updatedDescription = `${latestActivityDescription.replace(
    "🐾",
    ""
  )} | 🐾🐕 YTD = ${totalDistance}km`;
  console.log(updatedDescription);

  await updateDescription(latestActivityId, updatedDescription);
};
getAthlete();
