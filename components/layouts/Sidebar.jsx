import Link from "next/link";

import React, { Fragment } from "react";
import { withRouter, useRouter } from "next/router";
import AppContext, {
  UPDATE_ROLE,
  CREATE_ROLE,
  READ_ROLE,
  DELETE_ROLE,
  UPDATE_ADMIN,
  READ_ADMIN,
  DELETE_ADMIN,
  CREATE_ADMIN
} from "../../store";

const Sidebar = React.memo(() => {
  const router = useRouter();
  const [
    { user },
    ,
    { permitTo, permitToParent, hasRoleOf }
  ] = React.useContext(AppContext);

  const [links, setlinks] = React.useState([
    { name: "Home", href: "/", icon: "fas fa-home" },
    {
      name: "Mailing List",
      href: "/mailinglist",
      icon: "fas fa-user"
    },
    {
      name: "Campaign",
      href: "/campaigns",
      icon: "fas fa-user"
    },
    {
      name: "Settings",
      items: [
        {
          name: "Active Service",
          href: "/service",
          icon: "fas fa-user"
        }
      ]
    },
    {
      name: "Settings",
      items: linkSetting()
    }
  ]);

  function linkCourse() {
    let links = [];
    if (permitToParent("Course")) {
      links.push({
        name: "DB Courses",
        href: "/course/db",
        icon: "fab fa-discourse"
      });
    }

    return links;
  }

  function linkSetting() {
    let links = [];
    // if (permitToParent("Admin")) {
    links.push({
      name: "Admins",
      href: "/settings/admins",
      icon: "fas fa-users"
    });
    // }

    // if (permitToParent("Role")) {
    links.push({
      name: "Role and Permissions",
      href: "/settings/roles-permissions",
      icon: "fas fa-user-tag"
    });
    // }

    links.push({
      name: "Change Password",
      href: "/settings/password",
      icon: "fas fa-key"
    });
    return links;
  }

  function active(href) {
    return router.route === href
      ? "border-b border-yellow-400 text-yellow-400"
      : "text-gray-400";
  }

  return (
    <aside className="container pt-3 w-1/6 bg-gray-800">
      <ul>
        {links.map(link => {
          if (!link) return;
          if (link.items) {
            return (
              <Fragment key={link.name}>
                <li className="text-gray-600 ml-10 mt-5 uppercase text-xs tracking-widest font-semibold">
                  {link.name}
                </li>
                {link.items.map(item => {
                  return (
                    <li
                      className="text-gray-500 justify-start flex ml-10"
                      key={item.name}
                    >
                      <Link href={item.href}>
                        <a
                          className={`w-full flex px-2 py-1 text-sm -mx-2 rounded pt-2 relative block hover:border-b hover:text-yellow-400  ${active(
                            item.href
                          )}`}
                        >
                          <i className={`${item.icon} mr-2 flex py-1 w-2/12`} />
                          <p className="w-10/12">{item.name}</p>
                        </a>
                      </Link>
                    </li>
                  );
                })}
              </Fragment>
            );
          } else {
            return (
              <li
                className="text-gray-500 justify-start flex ml-10"
                key={link.name}
              >
                <Link href={link.href}>
                  <a
                    className={`w-full flex px-2 py-1 text-sm -mx-2 rounded pt-2 relative block hover:border-b hover:text-yellow-400  ${active(
                      link.href
                    )}`}
                  >
                    <i className={`${link.icon} mr-2 flex py-1 w-2/12`} />
                    <p className="w-10/12">{link.name}</p>
                  </a>
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </aside>
  );
});

export default withRouter(Sidebar);
