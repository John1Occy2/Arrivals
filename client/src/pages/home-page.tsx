import { useQuery } from "@tanstack/react-query";
import { Hotel } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { HotelCard } from "@/components/ui/hotel-card";
import { SearchFilters } from "@/components/ui/search-filters";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LogOut, Plus } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { data: hotels = [] } = useQuery<Hotel[]>({ 
    queryKey: ["/api/hotels"]
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">AfriStay</h1>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">Welcome, {user?.name}</span>
              {user?.isHotelOwner && (
                <Link href="/hotels/register">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    List Your Property
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-8 max-w-2xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4 text-foreground"
            >
              Discover African Hospitality
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              Experience the warmth and beauty of Africa through our carefully curated collection of hotels
            </motion.p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SearchFilters />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
        >
          {hotels.map((hotel) => (
            <motion.div key={hotel.id} variants={itemVariants}>
              <HotelCard hotel={hotel} />
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}