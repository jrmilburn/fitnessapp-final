import LinksSet from "./LinksSet"

export default function SidebarLinks() {

    const links = [
        {
            id: 1,
            title: "Current Workout",
            href: "/workout",
            icon: "/icons/home.svg"
        },
        {
            id: 2,
            title: "New Program",
            href: "/program",
            icon: "/icons/program.svg"
        }
    ]

    return (
        <LinksSet 
            links={links}
        />
    )

}