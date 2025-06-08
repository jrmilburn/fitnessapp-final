import {
  Dumbbell,      // workout
  Library,       // programmes
  ListChecks,    // exercises
  BarChart2,     // analytics (root)
  Activity,      // volume detail
  TrendingUp,    // traffic detail
  Layers,        // integrations
} from "lucide-react";

const NAVIGATION = [
  { kind: "header", title: "Main items" },
  { segment: "workout",     title: "Workout",     icon: <Dumbbell   size={18} /> },
  { segment: "program",     title: "Programmes",  icon: <Library    size={18} /> },
  { segment: "exercises",   title: "Exercises",   icon: <ListChecks size={18} /> },
  { kind: "divider" },
  { kind: "header", title: "Activities" },
  {
    segment: "activities",
    title: "Activites",
    icon: <Activity size={18} />,
  },
  { kind: "divider" },
  { kind: "header", title: "Analytics" },
  {
    segment: "analytics",
    title: "Analytics",
    icon: <BarChart2 size={18} />,
  },
  { segment: "integrations", title: "Integrations", icon: <Layers size={18} /> },
];

export default NAVIGATION;
