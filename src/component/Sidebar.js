import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "primereact/menu";
import { useAuth } from "../auth/useAuth";

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    // console.log(user)
    const {signout} = useAuth()
    const itemsAdmin = [
        {
            label: "Dashboard",
            icon: "pi pi-th-large",
            template: (item, options) => {
                return (
                    <Link to="/admin/dashboard" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Data User",
            icon: "pi pi-user",
            template: (item, options) => {
                return (
                    <Link to="/admin/user" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Data Alternatif",
            icon: "pi pi-users",
            template: (item, options) => {
                return (
                    <Link to="/admin/alternatif" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Data Kriteria",
            icon: "pi pi-list",
            template: (item, options) => {
                return (
                    <Link to="/admin/kriteria" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Input Penilaian",
            icon: "pi pi-pencil",
            template: (item, options) => {
                return (
                    <Link to="/admin/alternatifkriteria" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Input Perbandingan Kriteria",
            icon: "pi pi-pencil",
            template: (item, options) => {
                return (
                    <Link to="/admin/perbandingan" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Analisa Dematel",
            icon: "pi pi-chart-bar",
            template: (item, options) => {
                return (
                    <Link to="/admin/dematel" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Analisa Vikor",
            icon: "pi pi-chart-bar",
            template: (item, options) => {
                return (
                    <Link to="/admin/vikor" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Sign Out",
            icon: "pi pi-sign-out",
            command: () => signout()
        }
    ]
    const itemsDm = [
        {
            label: "Dashboard",
            icon: "pi pi-th-large",
            template: (item, options) => {
                return (
                    <Link to="/admin/dashboard" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Input Penilaian",
            icon: "pi pi-pencil",
            template: (item, options) => {
                return (
                    <Link to="/admin/alternatifkriteria" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Analisa Dematel",
            icon: "pi pi-chart-bar",
            template: (item, options) => {
                return (
                    <Link to="/admin/dematel" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Analisa Vikor",
            icon: "pi pi-chart-bar",
            template: (item, options) => {
                return (
                    <Link to="/admin/vikor" className={options.className}>
                        <span className={options.iconClassName}></span>
                        <span className={options.labelClassName}>{ item.label }</span>
                    </Link>
                )
            }
        },
        {
            label: "Sign Out",
            icon: "pi pi-sign-out",
            command: () => signout()
        }
    ]

    return(
        <div className="sidebar">
            <h4>Main {user.role}</h4>
            {user.role==="admin" ? (
                <Menu model={itemsAdmin}/>
            ) : (
                <Menu model={itemsDm}/>
            )}
        </div>
    )
}

export default Sidebar;