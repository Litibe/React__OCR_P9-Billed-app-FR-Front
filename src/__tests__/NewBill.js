/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import router from "../app/Router";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { bills } from "../fixtures/bills";
import mockedBills from "../__mocks__/store";
// scenario 5 E2E employee
describe("Given I am connected as an employee", () => {
    describe("When I navigate to NewBill Page", () => {
        beforeEach(() => {
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: "employee@test.tld",
                    password: "employee",
                    status: "connected",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.appendChild(root);
            router();
            window.onNavigate(ROUTES_PATH.NewBill);
        });
        test("Then i can see the NewBillPage Title", () => {
            const contentTitle = screen.getByText("Envoyer une note de frais");
            expect(contentTitle).toBeTruthy();
        });
        test("Then i can see the Form", () => {
            const contentForm = screen.getByTestId("form-new-bill");
            expect(contentForm).toBeTruthy();
        });
        test("Then i can see the expense-type into Form", () => {
            const contentExpenseType = screen.getByTestId("expense-type");
            expect(contentExpenseType).toBeDefined();
            expect(contentExpenseType).toBeRequired();
        });
        test("Then i can see the expense-name into Form", () => {
            const contentExpenseName = screen.getByTestId("expense-name");
            expect(contentExpenseName).toBeDefined();
            expect(contentExpenseName).toBeRequired();
            expect(contentExpenseName).toHaveAttribute("type", "text");
        });
        test("Then i can see the datepicker into Form", () => {
            const contentDatePicker = screen.getByTestId("datepicker");
            expect(contentDatePicker).toBeDefined();
            expect(contentDatePicker).toBeRequired();
            expect(contentDatePicker).toHaveAttribute("type", "date");
        });
        test("Then i can see the amount into Form", () => {
            const contentAmount = screen.getByTestId("amount");
            expect(contentAmount).toBeDefined();
            expect(contentAmount).toBeRequired();
            expect(contentAmount).toHaveAttribute("type", "number");
            expect(contentAmount).toHaveAttribute("min", "0");
            expect(contentAmount).toHaveAttribute("step", "0.01");
        });
        test("Then i can see the vat into Form", () => {
            const contentVat = screen.getByTestId("vat");
            expect(contentVat).toBeDefined();
            expect(contentVat).toBeRequired();
            expect(contentVat).toHaveAttribute("type", "number");
            expect(contentVat).toHaveAttribute("min", "0");
            expect(contentVat).toHaveAttribute("step", "0.01");
        });
        test("Then i can see the Pct into Form", () => {
            const contentPct = screen.getByTestId("pct");
            expect(contentPct).toBeDefined();
            expect(contentPct).toBeRequired();
            expect(contentPct).toHaveAttribute("type", "number");
            expect(contentPct).toHaveAttribute("min", "0");
            expect(contentPct).toHaveAttribute("step", "0.01");
        });
        test("Then i can see the commentary into Form", () => {
            const contentCommentary = screen.getByTestId("commentary");
            expect(contentCommentary).toBeDefined();
            expect(contentCommentary).not.toBeRequired();
        });
        test("Then i can see the file into Form", () => {
            const contentFile = screen.getByTestId("inputfile");
            expect(contentFile).toBeDefined();
            expect(contentFile).toBeRequired();
            expect(contentFile).toHaveAttribute("type", "file");
            // accept only photo file
            expect(contentFile).toHaveAttribute("accept", ".jpg,.jpeg,.png");
        });
        test("Then i can see the button into Form", () => {
            const contentCommentary = screen.getByTestId("btn-send-bill");
            expect(contentCommentary).toBeDefined();
            expect(contentCommentary).toHaveAttribute("type", "submit");
        });

        test("Then i can see the Icon Window button to navigate to My Bills", () => {
            handleClickBills = jest.fn(() => {
                window.onNavigate(ROUTES_PATH.Bills);
            });
            const iconWindow = screen.getByTestId("icon-window");
            iconWindow.addEventListener("click", handleClickBills);
            expect(iconWindow).toBeDefined();
            userEvent.click(iconWindow);
            expect(handleClickBills).toHaveBeenCalled();
        });
    });
});

// scenario 6 E2E employee
describe("Given I am connected as an employee & I navigate to NewBill Page", () => {
    describe("When I complete the form (all is valid)", () => {
        beforeEach(() => {
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    type: "Employee",
                    email: "employee@test.tld",
                    password: "employee",
                    status: "connected",
                })
            );
            const root = document.createElement("div");
            root.setAttribute("id", "root");
            document.body.appendChild(root);
            document.body.innerHTML = NewBillUI();
            const contentExpenseType = screen.getByTestId("expense-type");
            contentExpenseType.value = "Restaurants et bars";
            const contentExpenseName = screen.getByTestId("expense-name");
            contentExpenseName.value = "Note de resto";
            const contentDatePicker = screen.getByTestId("datepicker");
            contentDatePicker.value = "2022-05-01";
            const contentAmount = screen.getByTestId("amount");
            contentAmount.value = 100;
            const contentVat = screen.getByTestId("vat");
            contentVat.value = 20;
            const contentPct = screen.getByTestId("pct");
            contentPct.value = 20;
            const contentCommentary = screen.getByTestId("commentary");
            contentCommentary.value = "Repas avec Commercial";
        });

        test("Then i can see the Imgfile into FileForm", () => {
            const inputFile = screen.getByTestId("inputfile");
            const file = new File(["(⌐□_□)"], "testImg.png", {
                type: "image/png",
            });
            fireEvent.change(inputFile, { target: { files: [file] } });
            // check if the file is there
            expect(inputFile.files[0].name).toBe("testImg.png");
            expect(inputFile.files[0]).toBe(file);
            expect(inputFile.files).toHaveLength(1);
        });
        test("Then i can upload the Imgfile into FileForm", () => {
            const inputFile = screen.getByTestId("inputfile");
            const file = new File(["(⌐□_□)"], "testImg.png", {
                type: "image/png",
            });
            userEvent.upload(inputFile, file);
        });

        test("Then i can upload files and submit form", async () => {
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname });
            };
            const newBill = new NewBill({
                document,
                onNavigate,
                store: mockedBills,
                bills,
                localStorage: window.localStorage,
            });

            const file = new File(["(⌐□_□)"], "testImg.png", {
                type: "image/png",
            });
            const inputFile = screen.getByTestId("inputfile");
            fireEvent.change(inputFile, { target: { files: [file] } });

            const spyHandleChangeFile = jest.fn((e) =>
                newBill.handleChangeFile(e)
            );
            fireEvent.click(inputFile, () => {
                expect(spyHandleChangeFile).toHaveBeenCalled();
            });

            const btnSubmitForm = screen.getByTestId("btn-send-bill");

            const spyHandleSubmit = jest.fn((e) => newBill.handleSubmit(e));
            fireEvent.click(btnSubmitForm, () => {
                expect(spyHandleSubmit).toHaveBeenCalled();
            });
        });
    });
});
