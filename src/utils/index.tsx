import { Calendar, CalendarDays, Grid2X2, Inbox } from "lucide-react";

export const primaryNavItems = [
  {
    name: "Inbox",
    link: "/logged-in",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    name: "Today",
    link: "/logged-in/today",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    name: "Upcoming",
    link: "/logged-in/upcoming",
    icon: <CalendarDays className="h-4 w-4" />,
  },
  {
    name: "Filter & Labels",
    link: "/logged-in/filter-labels",
    icon: <Grid2X2 className="h-4 w-4" />,
  },
];
