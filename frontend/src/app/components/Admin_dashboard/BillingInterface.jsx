"use client";

import React, { useState, useEffect } from "react";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";
import toast from "react-hot-toast";

// Simple icon components
const Plus = () => <span className="text-lg">+</span>;
const Trash2 = ({ className }) => (
  <span className={`text-lg ${className}`}>🗑️</span>
);
const QrCode = () => <span className="text-2xl">📱</span>;
const Printer = () => <span className="text-lg">🖨️</span>;

const BillingInterface = ({
  patientData = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    appointmentDate: "2025-08-04",
    appointmentTime: "10:00 AM",
  },
  clinicData = {
    name: "PhysioCare Wellness Clinic",
    address: "123 Health Street, Medical Complex, Bengaluru - 560001",
    phone: "+91 80 1234 5678",
    email: "info@physiocare.com",
    gstNo: "29ABCDE1234F1Z5",
  },
  setShowBilling,
  showBilling,
  selectedPatient,
}) => {
  const [billItems, setBillItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Predefined services
  const predefinedServices = [
    { name: "Initial Consultation", rate: 500 },
    { name: "Follow-up Session", rate: 300 },
    { name: "Physiotherapy Session", rate: 700 },
    { name: "Manual Therapy", rate: 600 },
    { name: "Advanced Therapy", rate: 900 },
    { name: "Exercise Prescription", rate: 400 },
    { name: "Knee Brace", rate: 450 },
    { name: "Exercise Band", rate: 250 },
    { name: "Hot/Cold Pack", rate: 150 },
    { name: "Posture Corrector", rate: 800 },
  ];

  // Generate invoice number on component mount
  useEffect(() => {
    const today = new Date();
    const invoiceNum = `INV${today.getFullYear()}${String(
      today.getMonth() + 1
    ).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}${String(
      Math.floor(Math.random() * 1000)
    ).padStart(3, "0")}`;
    setInvoiceNumber(invoiceNum);
  }, []);

  const addBillItem = () => {
    const newItem = {
      id: Date.now(),
      service: "",
      customService: "",
      quantity: 1,
      rate: 0,
      isCustom: false,
    };
    setBillItems([...billItems, newItem]);
  };

  const removeBillItem = (id) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const updateBillItem = (id, field, value) => {
    setBillItems(
      billItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // If service is selected from dropdown, update rate
          if (field === "service" && value !== "custom") {
            const selectedService = predefinedServices.find(
              (s) => s.name === value
            );
            if (selectedService) {
              updatedItem.rate = selectedService.rate;
              updatedItem.isCustom = false;
            }
          }

          // If custom is selected, clear the service and enable custom input
          if (field === "service" && value === "custom") {
            updatedItem.isCustom = true;
            updatedItem.service = "";
            updatedItem.rate = 0;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const getLineTotal = (item) => {
    return item.quantity * item.rate;
  };

  const getSubtotal = () => {
    return billItems.reduce((sum, item) => sum + getLineTotal(item), 0);
  };

  const getGST = () => {
    return Math.round(getSubtotal() * 0.18);
  };

  const getGrandTotal = () => {
    return getSubtotal() + getGST();
  };

  const handlePrint = () => {
    window.print();
  };

  const generateBill = async () => {
    if (isGenerating) return;
    if (billItems.length === 0) {
      toast.error("Cannot generate an empty bill. Please add items.");
      return;
    }

    setIsGenerating(true);

    const payload = {
      appointmentId: selectedPatient.appointment_id,
      patientId: selectedPatient.patient.patient_id,
      items: billItems.map((item) => ({
        description: item.isCustom ? item.customService : item.service,
        amount: getLineTotal(item),
      })),
      tax: getGST(),
    };

    try {
      const response = await Axios({
        url: summaryApi.getBilling.endpoint,
        method: summaryApi.getBilling.method,
        data: payload,
      });
      toast.success(response.data.message || "Bill saved successfully!");
      setShowBilling(false); // Close modal on success
    } catch (error) {
      console.error("Failed to generate bill:", error);
      toast.error(error.response?.data?.message || "Failed to save the bill.");
    } finally {
      setIsGenerating(false);
    }
  };
  const handleExit = () => {
    setShowBilling(!showBilling);
  };
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 print:bg-white print:text-black print:border-b-2 print:border-blue-600">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{clinicData.name}</h1>
            <p className="text-blue-100 print:text-gray-600 mt-1">
              {clinicData.address}
            </p>
            <p className="text-blue-100 print:text-gray-600">
              📞 {clinicData.phone} | 📧 {clinicData.email}
            </p>
            <p className="text-blue-100 print:text-gray-600 text-sm mt-1">
              GST No: {clinicData.gstNo}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white print:bg-gray-100 text-blue-600 print:text-black px-4 py-2 rounded-lg">
              <p className="text-lg font-bold">INVOICE</p>
              <p className="text-sm">{invoiceNumber}</p>
            </div>
          </div>
          <div onClick={handleExit}>X</div>
        </div>
      </div>

      {/* Patient Info */}
      <div className="p-6 border-b print:border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="capitalize">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Bill To:
            </h3>
            <p className="font-medium text-gray-900">
              {selectedPatient.patient.name}
            </p>
            <p className="text-gray-600">
              +91 {selectedPatient.patient.phone_number}
            </p>
          </div>
          <div className="text-left md:text-right">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Appointment Details:
            </h3>
            <p className="text-gray-600">
              Date:{" "}
              {new Date(selectedPatient.appointmentDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">Time: {selectedPatient.slot.slot}</p>
            <p className="text-gray-600">
              Bill Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Billing Items */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h3 className="text-lg font-semibold text-gray-800">
            Services & Items
          </h3>
          <button
            onClick={addBillItem}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus />
            <span>Add Item</span>
          </button>
        </div>

        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 print:bg-gray-100">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  Item Description
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-20">
                  Qty
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700 w-24">
                  Rate (₹)
                </th>
                <th className="border border-gray-300 px-4 py-3 text-right font-semibold text-gray-700 w-24">
                  Total (₹)
                </th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-16 print:hidden">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">
                    {item.isCustom ? (
                      <input
                        type="text"
                        value={item.customService}
                        onChange={(e) =>
                          updateBillItem(
                            item.id,
                            "customService",
                            e.target.value
                          )
                        }
                        placeholder="Enter custom service name"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0"
                      />
                    ) : (
                      <select
                        value={item.service}
                        onChange={(e) =>
                          updateBillItem(item.id, "service", e.target.value)
                        }
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0"
                      >
                        <option value="">Select Service</option>
                        {predefinedServices.map((service) => (
                          <option key={service.name} value={service.name}>
                            {service.name} - ₹{service.rate}
                          </option>
                        ))}
                        <option value="custom">Custom Item</option>
                      </select>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateBillItem(
                          item.id,
                          "quantity",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={item.rate}
                      onChange={(e) =>
                        updateBillItem(
                          item.id,
                          "rate",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full p-2 border rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                    ₹{getLineTotal(item).toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center print:hidden">
                    <button
                      onClick={() => removeBillItem(item.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {billItems.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                  >
                    No items added. Click "Add Item" to start billing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        {billItems.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-end">
              <div className="w-full max-w-sm">
                <div className="border border-gray-300 bg-gray-50 print:bg-gray-100">
                  <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                    <span className="font-medium">Subtotal:</span>
                    <span>₹{getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                    <span className="font-medium">GST (18%):</span>
                    <span>₹{getGST().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between px-4 py-3 bg-blue-600 text-white print:bg-gray-800 print:text-white font-bold text-lg">
                    <span>Grand Total:</span>
                    <span>₹{getGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment & QR Section */}
      {billItems.length > 0 && (
        <div className="p-6 bg-gray-50 print:bg-white border-t print:border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Payment Mode</h4>
              <select
                value={paymentMode}
                onChange={(e) => {
                  setPaymentMode(e.target.value);
                  setShowQR(e.target.value === "UPI");
                }}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            {(paymentMode === "UPI" || showQR) && (
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-3">
                  UPI Payment
                </h4>
                <div className="inline-block p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <QrCode />
                  <p className="text-sm text-gray-600 mt-2">
                    QR Code for ₹{getGrandTotal()}
                  </p>
                  <p className="text-xs text-gray-500">Scan to pay via UPI</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-6 bg-blue-50 print:bg-white border-t print:border-gray-300">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800 mb-2">
            Thank you for choosing {clinicData.name}!
          </p>
          <p className="text-sm text-gray-600">
            Get well soon. For any queries, please contact us.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            * This is a computer generated invoice. No signature required.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-white border-t print:hidden">
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrint}
            disabled={billItems.length === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Printer />
            <span>Print Bill</span>
          </button>
          <button
            onClick={generateBill}
            disabled={billItems.length === 0 || isGenerating}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            {isGenerating ? "Generating..." : "Generate Bill"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingInterface;
