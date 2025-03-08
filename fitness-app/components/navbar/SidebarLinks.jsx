import LinksSet from "./LinksSet"

export default function SidebarLinks() {

    const links = [
        {
            id: 1,
            title: "Home",
            href: "/workout",
            icon: "/icons/home.svg"
        },
        {
            id: 2,
            title: "Programmes",
            href: "/program",
            icon: "/icons/program.svg"
        },
        {
            id: 3,
            title: "New",
            href: "/new",
            icon: "/icons/plus.svg"

        },
        {
            id: 4,
            title: "Analytics",
            href: "/analytics",
            icon: "/icons/analytics.svg"
        }
    ]

    return (
        <LinksSet 
            links={links}
        />
    )

}