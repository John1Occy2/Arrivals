import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function SearchFilters() {
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg shadow">
      <div>
        <label className="text-sm font-medium mb-2 block">
          Location
        </label>
        <Input
          placeholder="Where are you going?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          Price Range
        </label>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-100">$0 - $100</SelectItem>
            <SelectItem value="100-200">$100 - $200</SelectItem>
            <SelectItem value="200-300">$200 - $300</SelectItem>
            <SelectItem value="300+">$300+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
