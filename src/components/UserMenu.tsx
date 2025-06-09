import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, MapPin, Calendar, Coins, Gift, Crown, DollarSign } from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserMenu: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getDisplayName = (firstName?: string | null, lastName?: string | null) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;
    return user.primaryEmailAddress?.emailAddress || "User";
  };  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 rounded-full px-3 py-2 hover:bg-gray-100">
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-900">
                Welcome, {getDisplayName(user.firstName, user.lastName)}
              </span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={getDisplayName(user.firstName, user.lastName)} />
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getDisplayName(user.firstName, user.lastName)}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          <Link to="/planner" className="cursor-pointer">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Trip Planner</span>
          </Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem asChild>
          <Link to="/my-credits" className="cursor-pointer">
            <Coins className="mr-2 h-4 w-4" />
            <span>My Credits</span>
          </Link>
        </DropdownMenuItem>        <DropdownMenuItem asChild>
          <Link to="/rewards" className="cursor-pointer">
            <Gift className="mr-2 h-4 w-4" />
            <span>Rewards & Credits</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/premium" className="cursor-pointer">
            <Crown className="mr-2 h-4 w-4" />
            <span>Premium Subscription</span>
          </Link>
        </DropdownMenuItem>        <DropdownMenuItem asChild>
          <Link to="/my-trips" className="cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            <span>My Trips</span>
          </Link>
        </DropdownMenuItem>        <DropdownMenuItem asChild>
          <Link to="/my-expenses" className="cursor-pointer">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>My Travel Expenses</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
