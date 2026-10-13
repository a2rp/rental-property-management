![Hearthline rental property dashboard](./screenshot.png)

# Hearthline Property Desk

A frontend-only workspace for residential property managers. Review a rental portfolio, keep lease and rent records current, and organize maintenance requests in one clear desk.

**Live demo:** https://a2rp.github.io/rental-property-management/

This app uses fictional properties and residents. It has no backend, payment processing, or external service connection. Changes are held in React state while the app is open and reset when the page is refreshed.

## What you can do

- Review portfolio size, occupancy, rent collection, work orders, and upcoming lease dates on the overview.
- Create, edit, search, filter, sort, inspect, and remove property records. Properties with active leases cannot be removed. Occupancy cannot be set below active leases.
- Create and edit lease records, mark rent as received in the demo, inspect terms, and end an agreement. New active leases update property occupancy, and ending a lease updates it again. The rent action records a demo status only; no payment is collected.
- Add maintenance requests, search and filter by status or priority, update work status, view details, and remove a request after confirmation.
- Open portfolio attention items for unpaid rent, high priority work, and leases ending soon.
- Use custom validation, confirmation dialogs, and dismissible notifications throughout the workflow.
- Use the responsive navigation on desktop and mobile. The fixed header hides while scrolling down and returns while scrolling up.

The sample data is in `src/data/seed.js`. All records are in memory, so a refresh restores those examples.

## Pages

- `/overview` - portfolio summary and follow-up actions
- `/properties` - property portfolio and property records
- `/leases` - agreements, rent status, and lease dates
- `/maintenance` - resident requests and property work queue
- Any unknown route opens the not-found page

The app uses BrowserRouter and GitHub Pages' `404.html` copy to render direct route visits.

## Local setup

```bash
npm install
npm run dev
```

Run the project checks:

```bash
npm run lint
npm run build
npm audit
```

Deploy the current build to GitHub Pages:

```bash
npm run deploy
```

The deploy script builds the app, copies `dist/index.html` to `dist/404.html`, and publishes `dist` to the `gh-pages` branch. GitHub Pages should use that branch and the root folder as its source.

## Screenshots

These screenshots were captured from the running application at desktop and mobile sizes. They show the actual pages, forms, details, confirmations, and navigation.

### Pages

#### Overview

![Overview page with portfolio, rent collection, work orders, properties, and lease dates](./screenshots/pages/overview.png)

#### Properties

![Property portfolio page with property cards, occupancy, and portfolio filters](./screenshots/pages/properties.png)

#### Leases

![Lease management page with residents, rent status, agreement terms, and filters](./screenshots/pages/leases.png)

#### Maintenance

![Maintenance queue page with request cards, status controls, and priority filters](./screenshots/pages/maintenance.png)

#### Not found

![Custom not-found page with a return link to the overview](./screenshots/pages/not-found.png)

### Property dialogs

#### Create property

![Add property form with address, unit, occupancy, rent potential, and owner fields](./screenshots/modals/property-create.png)

#### Edit property

![Edit property form with existing portfolio values](./screenshots/modals/property-edit.png)

#### Property details

![Property details dialog with occupancy and management information](./screenshots/modals/property-details.png)

#### Remove property confirmation

![Confirmation dialog before removing a property](./screenshots/modals/property-remove-confirm.png)

### Lease dialogs

#### Create lease

![Add lease form for resident, property, rent, deposit, and lease dates](./screenshots/modals/lease-create.png)

#### Edit lease

![Edit lease form with existing resident and agreement information](./screenshots/modals/lease-edit.png)

#### Lease details

![Lease details dialog with rent, deposit, resident, and agreement dates](./screenshots/modals/lease-details.png)

#### End lease confirmation

![Confirmation dialog before ending a resident lease](./screenshots/modals/lease-end-confirm.png)

### Maintenance dialogs

#### Create request

![Maintenance request form for issue details, property, resident, and priority](./screenshots/modals/maintenance-create.png)

#### Request details

![Maintenance details dialog with priority, property, resident, and status controls](./screenshots/modals/maintenance-details.png)

#### Remove request confirmation

![Confirmation dialog before removing a maintenance request](./screenshots/modals/maintenance-remove-confirm.png)

### Other dialogs and responsive navigation

#### Portfolio attention

![Portfolio attention dialog listing unpaid rent, urgent work, and upcoming lease dates](./screenshots/modals/notifications.png)

#### Mobile navigation

![Mobile navigation open above the responsive overview dashboard](./screenshots/modals/mobile-navigation.png)

## Future improvements

These are backend or production extensions; the main client-side workflows above are implemented.

- Shared server storage, team accounts, and role-based permissions for multiple property managers.
- Payment provider integration, real payment reconciliation, and owner statements.
- Resident and vendor portals with maintenance scheduling, reminders, and appointment coordination.
- Secure hosted lease documents and server-side audit history.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
