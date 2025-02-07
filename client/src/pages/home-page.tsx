import { useQuery } from "@tanstack/react-query";
import { Hotel } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { HotelCard } from "@/components/ui/hotel-card";
import { SearchFilters } from "@/components/ui/search-filters";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { data: hotels = [] } = useQuery<Hotel[]>({ 
    queryKey: ["/api/hotels"]
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">AfriStay</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user.name}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SearchFilters />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </main>
    </div>
  );
}
