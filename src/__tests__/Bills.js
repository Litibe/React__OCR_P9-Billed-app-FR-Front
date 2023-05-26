/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockedBills from "../__mocks__/store";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        beforeEach(() => {
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Bills);
            document.body.innerHTML = BillsUI({ data: bills });
        });

        test("Then bill icon in vertical layout should be highlighted", async () => {
            const classWaitFor = await waitFor(() =>
                screen
                    .getByTestId("icon-window")
                    .classList.contains("active-icon")
            );
            expect(classWaitFor).toBeTruthy;
        });
        test("Then bills should be ordered from latest (2023) to earliest(2020)", () => {
            // bill mocked will be sorted to compare with the dom !
            const orderedBills = bills;
            orderedBills.sort((a, b) => {
                if (a["date"] < b["date"]) return 1;
                if (a["date"] > b["date"]) return -1;
            });
            document.body.innerHTML = BillsUI({ data: bills });
            const dates = screen
                .getAllByText(
                    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
                )
                .map((a) => a.innerHTML);
            const antiChrono = (a, b) => (a < b ? 1 : -1);
            const datesSorted = [...dates].sort(antiChrono);
            expect(dates).toEqual(datesSorted);
        });

        test("Then bills Listing icon in vertical layout should be, it should render icon mail", async () => {
            const classWaitFor = await waitFor(() =>
                screen.getByTestId("icon-mail").classList.contains("icon-mail")
            );
            expect(classWaitFor).toBeTruthy;
        });
        test("Then i can have a array of database bills", async () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };
            const containersBill = new Bills({
                document,
                onNavigate,
                store: mockedBills,
                localStorage: window.localStorage,
            });

            const spyHandleGetBills = jest.fn(containersBill.getBills);
            await waitFor(spyHandleGetBills);

            expect(spyHandleGetBills).toHaveBeenCalled();
        });
        test("Then it sould be have icon download file bill === number of bill ", async () => {
            const iconDownloadBill = await waitFor(() =>
                screen.getAllByTestId("icon-download")
            );
            expect(iconDownloadBill.length).toEqual(bills.length);
        });
        test("Then it sould be have on rows bills", () => {
            document.body.innerHTML = BillsUI({ data: bills });
            const arrayBills = screen.queryByTestId("tbody");
            expect(arrayBills).toBeDefined();
            expect(arrayBills.rows.length).toEqual(bills.length);
        });
        test("Then it sould be have on a icon download  on first row", async () => {
            // 1st icon download into table
            const oneBill = screen.getByText("test1");
            expect(oneBill).toBeDefined();
            const oneIconDownload = screen.queryAllByTestId("icon-download")[0];
            expect(oneIconDownload).toBeDefined();
            fireEvent.click(oneIconDownload);
        });
        test("Then it sould be have on a link download  on first row", async () => {
            const oneIconDownload = screen.queryAllByTestId("icon-download")[0];
            expect(oneIconDownload.getAttribute("file")).toEqual(
                bills[0].fileUrl.split("?")[0]
            );
        });
        test("Then it sould be have a new bill button ", async () => {
            const iconBtnNewBill = await waitFor(() =>
                screen.getByText("Nouvelle note de frais")
            );
            expect(iconBtnNewBill).toBeTruthy;
        });
        test("Then it sould be have on a icon eye  on first row", async () => {
            const oneIconEye = await waitFor(
                () => screen.getAllByTestId("icon-eye")[0]
            );
            expect(oneIconEye.nodeName).toBe("DIV");
            expect(oneIconEye.getAttribute("data-bill-url")).toBeDefined();

            fireEvent.click(oneIconEye);
        });
        test("Then i can view a bill files", async () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };
            const containersBill = new Bills({
                document,
                onNavigate,
                store: mockedBills,
                localStorage: window.localStorage,
            });
            const oneIconEye = await waitFor(
                () => screen.getAllByTestId("icon-eye")[0]
            );
            expect(oneIconEye.nodeName).toBe("DIV");
            expect(oneIconEye.getAttribute("data-bill-url")).toBeDefined();

            /* console.error
              Error: Uncaught [TypeError: $(...).modal is not a function]
              */
            /* Mock fonction JQuery native modal */
            $.fn.modal = jest.fn();
            const spyHandleViewFile = jest.fn(
                containersBill.handleClickIconEye(oneIconEye)
            );
            fireEvent.click(oneIconEye, () => {
                expect(spyHandleViewFile).toHaveBeenCalled();
            });
        });
        test("Then i can download a bill files", async () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };
            const containersBill = new Bills({
                document,
                onNavigate,
                store: mockedBills,
                localStorage: window.localStorage,
            });
            document.body.innerHTML = BillsUI({ data: bills });
            const oneIconDownload = screen.queryAllByTestId("icon-download")[0];
            expect(oneIconDownload.getAttribute("file")).toEqual(
                bills[0].fileUrl.split("?")[0]
            );

            /* console.error
            Error: Uncaught [TypeError: $(...).modal is not a function]
            */
            /* Mock fonction JQuery native modal */
            $.fn.modal = jest.fn();
            const spyHandleDownloadFile = jest.fn(
                containersBill.handleClickIconDownload(oneIconDownload)
            );
            fireEvent.click(oneIconDownload, () => {
                expect(spyHandleDownloadFile).toHaveBeenCalled();
            });
        });
        test("Then i can click on a bills icon on vertical bar ", async () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };
            const containersBill = new Bills({
                document,
                onNavigate,
                store: mockedBills,
                localStorage: window.localStorage,
            });
            document.body.innerHTML = BillsUI({ data: bills });
            const iconWindowBill = screen.queryByTestId("icon-window");
            expect(iconWindowBill).toBeDefined;

            const spyHandleClickIconBillsVerticalBar = jest.fn(
                containersBill.handleClickBills()
            );
            fireEvent.click(iconWindowBill, () => {
                expect(spyHandleClickIconBillsVerticalBar).toHaveBeenCalled();
            });
        });
    });
    describe("When I clicked on new bill button", () => {
        beforeEach(() => {
            Object.defineProperty(window, "localStorage", {
                value: localStorageMock,
            });
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                })
            );

            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.append(root);
            router();
            window.onNavigate(ROUTES_PATH.Bills);
        });
        test("Then it sould be have a new bill page ", async () => {
            const bills = new Bills({
                document,
                onNavigate,
                store: mockedBills,
                localStorage: window.localStorage,
            });
            const btnNewBill = await waitFor(() =>
                screen.getByTestId("btn-new-bill")
            );

            const spyHandleClickNewBill = jest.fn(bills.handleClickNewBill());

            expect(btnNewBill).toBeTruthy;
            fireEvent.click(btnNewBill, () => {
                expect(spyHandleClickNewBill).toHaveBeenCalled();
            });

            expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
        });
    });
});
