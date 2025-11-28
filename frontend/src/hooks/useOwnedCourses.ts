import { useCallback, useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import { useAuth } from "./useAuth";

interface OwnedCourse {
  _id?: string;
  id?: string;
  slug?: string;
  title?: string;
}

export const useOwnedCourses = () => {
  const { isAuthenticated } = useAuth();
  const [ownedCourses, setOwnedCourses] = useState<OwnedCourse[]>([]);
  const [isLoadingOwnedCourses, setIsLoadingOwnedCourses] = useState(false);

  const ownedCourseIds = ownedCourses
    .map((course) => course._id || course.id || "")
    .filter(Boolean);

  const fetchOwnedCourses = useCallback(async () => {
    if (!isAuthenticated) {
      setOwnedCourses([]);
      return;
    }

    try {
      setIsLoadingOwnedCourses(true);
      const response = await axios.get("/orders/my-courses");
      if (response.data.success) {
        setOwnedCourses(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching owned courses:", error);
    } finally {
      setIsLoadingOwnedCourses(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOwnedCourses();
  }, [fetchOwnedCourses]);

  return {
    ownedCourses,
    ownedCourseIds,
    isLoadingOwnedCourses,
    refreshOwnedCourses: fetchOwnedCourses,
  };
};

