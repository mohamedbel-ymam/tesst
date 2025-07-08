import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useUserContext } from "../../../context/StudentContext";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay"; // optional autoplay
import { Button } from "../../ui/button";

export default function FirstDegreeDashboard() {
  const { user, setSelectedDegree } = useUserContext();
  const navigate = useNavigate();

  const dashboardCards = [
    { title: "Today's Classes", value: 3 },
    { title: "Pending Assignments", value: 2 },
    { title: "New Messages", value: 1 },
  ];

  const carouselImages = [
    "/images/first-degree/slide1.jpg",
    "/images/first-degree/slide2.jpg",
    "/images/first-degree/slide3.jpg",
  ];

  const handleBack = () => {
    setSelectedDegree(null); // clear the selected degree
    navigate("/student/select-degree");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">First Degree Dashboard</h1>
        <Button onClick={handleBack} variant="outline">
          Choose Another Degree
        </Button>
      </div>

      {/* Carousel */}
      <Carousel
        plugins={[Autoplay({ delay: 3000 })]}
        className="w-full max-w-4xl mx-auto"
      >
        <CarouselContent>
          {carouselImages.map((src, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="rounded-xl w-full object-cover h-64"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dashboardCards.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
