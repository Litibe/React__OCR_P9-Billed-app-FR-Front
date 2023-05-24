import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

export default class {
    constructor({ document, onNavigate, store, localStorage }) {
        this.document = document;
        this.onNavigate = onNavigate;
        this.store = store;
        const buttonNewBill = document.querySelector(
            'button[data-testid="btn-new-bill"]'
        );
        if (buttonNewBill)
            buttonNewBill.addEventListener("click", this.handleClickNewBill);
        const iconEye = document.querySelectorAll(
            'div[data-testid="icon-eye"]'
        );
        if (iconEye) {
            iconEye.forEach((icon) => {
                icon.addEventListener("click", () =>
                    this.handleClickIconEye(icon)
                );
            });
        }
        const iconDownload = document.querySelectorAll(
            'div[data-testid="icon-download"]'
        );

        if (iconDownload) {
            iconDownload.forEach((icon) => {
                icon.addEventListener("click", () =>
                    this.handleClickIconDownload(icon)
                );
            });
        }
        const iconWindow = document.querySelector(
            'div[data-testid="icon-window"]'
        );
        iconWindow.addEventListener("click", () => this.handleClickBills(icon));

        const iconMail = document.querySelectorAll(
            'div[data-testid="icon-mail"]'
        );
        if (iconMail) {
            iconMail.forEach((icon) => {
                icon.addEventListener("click", () =>
                    this.handleClickNewBill(icon)
                );
            });
        }
        new Logout({ document, localStorage, onNavigate });
    }
    handleClickBills = () => {
        this.onNavigate(ROUTES_PATH.Bills);
    };

    handleClickNewBill = () => {
        this.onNavigate(ROUTES_PATH.NewBill);
    };

    handleClickIconEye = (icon) => {
        const billUrl = icon.getAttribute("data-bill-url");
        if (billUrl !== undefined && !billUrl.includes("null")) {
            const imgWidth = Math.floor($("#modaleFile").width() * 0.5);
            $("#modaleFile")
                .find(".modal-body")
                .html(
                    `<div style='text-align: center;' class="bill-proof-container" data-testid="modal-bill"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
                );
            $("#modaleFile").modal("show");
        }
    };

    handleClickIconDownload = (icon) => {
        const billUrl = icon.getAttribute("data-bill-url");
        icon.setAttribute(
            "href",
            `data:text/plain;charset=utf-8,${encodeURIComponent(billUrl)}`
        );
    };

    getBills = () => {
        if (this.store) {
            return this.store
                .bills()
                .list()
                .then((snapshot) => {
                    const bills = snapshot.map((doc) => {
                        try {
                            return {
                                ...doc,
                                date: formatDate(doc.date),
                                status: formatStatus(doc.status),
                            };
                        } catch (e) {
                            // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                            // log the error and return unformatted date in that case
                            //console.log(e, "for", doc);
                            return {
                                ...doc,
                                date: doc.date,
                                status: formatStatus(doc.status),
                            };
                        }
                    });
                    //console.log('length', bills.length);
                    return bills;
                });
        }
    };
}
