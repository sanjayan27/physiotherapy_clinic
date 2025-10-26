"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getBilling } from "@/app/services/billing.service";
import { Box, Paper, Stack, Typography, Button, TextField, Select, MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Divider } from "@mui/material";

type BillItem = { id: number; service: string; customService: string; quantity: number; rate: number; isCustom: boolean };

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

const BillingInterface: React.FC<{
  patientData?: any;
  clinicData?: any;
  setShowBilling: (v: boolean) => void;
  showBilling: boolean;
  selectedPatient: any;
}> = ({
  patientData = { name: "Rajesh Kumar", phone: "+91 98765 43210", appointmentDate: "2025-08-04", appointmentTime: "10:00 AM" },
  clinicData = { name: "PhysioCare Wellness Clinic", address: "123 Health Street, Medical Complex, Bengaluru - 560001", phone: "+91 80 1234 5678", email: "info@physiocare.com", gstNo: "29ABCDE1234F1Z5" },
  setShowBilling,
  showBilling,
  selectedPatient,
}) => {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [paymentMode, setPaymentMode] = useState<string>("Cash");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date();
    const invoiceNum = `INV${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`;
    setInvoiceNumber(invoiceNum);
  }, []);

  const addBillItem = () => {
    const newItem: BillItem = { id: Date.now(), service: "", customService: "", quantity: 1, rate: 0, isCustom: false };
    setBillItems((prev) => [...prev, newItem]);
  };

  const removeBillItem = (id: number) => {
    setBillItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateBillItem = (id: number, field: keyof BillItem, value: any) => {
    setBillItems((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const updated: BillItem = { ...item, [field]: value } as BillItem;
      if (field === "service" && value !== "custom") {
        const svc = predefinedServices.find((s) => s.name === value);
        if (svc) {
          updated.rate = svc.rate;
          updated.isCustom = false;
        }
      }
      if (field === "service" && value === "custom") {
        updated.isCustom = true;
        updated.service = "";
        updated.rate = 0;
      }
      return updated;
    }));
  };

  const getLineTotal = (item: BillItem) => item.quantity * item.rate;
  const subtotal = useMemo(() => billItems.reduce((sum, it) => sum + getLineTotal(it), 0), [billItems]);
  const gst = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const grandTotal = useMemo(() => subtotal + gst, [subtotal, gst]);

  const handlePrint = () => window.print();

  const generateBill = async () => {
    if (isGenerating) return;
    if (billItems.length === 0) {
      toast.error("Cannot generate an empty bill. Please add items.");
      return;
    }
    setIsGenerating(true);
    const payload = {
      appointmentId: selectedPatient.appointment_id,
      patientId: selectedPatient.user.id,
      items: billItems.map((i) => ({ description: i.isCustom ? i.customService : i.service, amount: getLineTotal(i) })),
      tax: gst,
    };
    try {
      const response: any = await getBilling(payload);
      toast.success(response?.message || "Bill saved successfully!");
      setShowBilling(false);
    } catch (error: any) {
      console.error("Failed to generate bill:", error);
      toast.error(error?.response?.message || "Failed to save the bill.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExit = () => setShowBilling(!showBilling);

  return (
    <Paper sx={{ maxWidth: 900, mx: "auto", overflow: "hidden" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "primary.main", color: "primary.contrastText", p: 3 }} className="print:bg-white print:text-black">
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight={800}>{clinicData.name}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>{clinicData.address}</Typography>
            <Typography variant="body2">📞 {clinicData.phone} | 📧 {clinicData.email}</Typography>
            <Typography variant="caption">GST No: {clinicData.gstNo}</Typography>
          </Box>
          <Box textAlign="right">
            <Paper sx={{ px: 2, py: 1, bgcolor: "background.default", color: "text.primary", display: "inline-block" }}>
              <Typography fontWeight={700}>INVOICE</Typography>
              <Typography variant="caption">{invoiceNumber}</Typography>
            </Paper>
          </Box>
          <Box onClick={handleExit} sx={{ cursor: "pointer" }}>X</Box>
        </Stack>
      </Box>

      {/* Patient Info */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Bill To:</Typography>
            <Typography fontWeight={600} sx={{ textTransform: "capitalize" }}>{selectedPatient.user.name}</Typography>
            <Typography color="text.secondary">+91 {selectedPatient?.user?.phoneNumber}</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Appointment Details:</Typography>
            <Typography color="text.secondary">Date: {new Date(selectedPatient.appointmentDate).toLocaleDateString()}</Typography>
            <Typography color="text.secondary">Time: {selectedPatient.slot.slot}</Typography>
            <Typography color="text.secondary">Bill Date: {new Date().toLocaleDateString()}</Typography>
          </Box>
        </Stack>
      </Box>

      {/* Billing Items */}
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }} className="print:hidden">
          <Typography variant="subtitle1" fontWeight={700}>Services & Items</Typography>
          <Button variant="contained" color="success" onClick={addBillItem}>Add Item</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item Description</TableCell>
              <TableCell align="center" sx={{ width: 100 }}>Qty</TableCell>
              <TableCell align="right" sx={{ width: 120 }}>Rate (₹)</TableCell>
              <TableCell align="right" sx={{ width: 140 }}>Total (₹)</TableCell>
              <TableCell align="center" className="print:hidden" sx={{ width: 80 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billItems.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  {item.isCustom ? (
                    <TextField fullWidth size="small" placeholder="Enter custom service name" value={item.customService} onChange={(e) => updateBillItem(item.id, "customService", e.target.value)} />
                  ) : (
                    <Select
                      fullWidth
                      size="small"
                      value={item.service}
                      displayEmpty
                      onChange={(e) => updateBillItem(item.id, "service", e.target.value)}
                    >
                      <MenuItem value=""><em>Select Service</em></MenuItem>
                      {predefinedServices.map((s) => (
                        <MenuItem key={s.name} value={s.name}>{s.name} - ₹{s.rate}</MenuItem>
                      ))}
                      <MenuItem value="custom">Custom Item</MenuItem>
                    </Select>
                  )}
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={item.quantity}
                    onChange={(e) => updateBillItem(item.id, "quantity", parseInt(e.target.value || "1", 10))}
                  />
                </TableCell>
                <TableCell align="right">
                  <TextField
                    size="small"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={item.rate}
                    onChange={(e) => updateBillItem(item.id, "rate", parseFloat(e.target.value || "0"))}
                  />
                </TableCell>
                <TableCell align="right">₹{getLineTotal(item).toFixed(2)}</TableCell>
                <TableCell align="center" className="print:hidden">
                  <Button color="error" onClick={() => removeBillItem(item.id)}>Remove</Button>
                </TableCell>
              </TableRow>
            ))}
            {billItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "text.secondary" }}>
                  No items added. Click "Add Item" to start billing.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {billItems.length > 0 && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "end" }}>
            <Box sx={{ width: 360, bgcolor: "grey.50", border: 1, borderColor: "divider" }}>
              <Stack direction="row" justifyContent="space-between" sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
                <Typography fontWeight={600}>Subtotal:</Typography>
                <Typography>₹{subtotal.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
                <Typography fontWeight={600}>GST (18%):</Typography>
                <Typography>₹{gst.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ px: 2, py: 1.5, bgcolor: "primary.main", color: "primary.contrastText" }}>
                <Typography fontWeight={800}>Grand Total:</Typography>
                <Typography fontWeight={800}>₹{grandTotal.toFixed(2)}</Typography>
              </Stack>
            </Box>
          </Box>
        )}
      </Box>

      {/* Payment & QR Section */}
      {billItems.length > 0 && (
        <Box sx={{ p: 3, bgcolor: "grey.50", borderTop: 1, borderColor: "divider" }} className="print:bg-white">
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={600} sx={{ mb: 1 }}>Payment Mode</Typography>
              <Select fullWidth size="small" value={paymentMode} onChange={(e) => { setPaymentMode(e.target.value as string); setShowQR((e.target.value as string) === "UPI"); }}>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
              </Select>
            </Box>
            {(paymentMode === "UPI" || showQR) && (
              <Box sx={{ flex: 1 }}>
                <Box textAlign="center" sx={{ p: 2, border: "2px dashed", borderColor: "divider", borderRadius: 2 }}>
                  <Typography fontWeight={600}>UPI Payment</Typography>
                  <Box sx={{ fontSize: 40, my: 1 }}>📱</Box>
                  <Typography variant="body2" color="text.secondary">QR Code for ₹{grandTotal}</Typography>
                  <Typography variant="caption" color="text.secondary">Scan to pay via UPI</Typography>
                </Box>
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ p: 3, bgcolor: "background.default", borderTop: 1, borderColor: "divider" }} className="print:bg-white">
        <Box textAlign="center">
          <Typography fontWeight={600} sx={{ mb: 0.5 }}>Thank you for choosing {clinicData.name}!</Typography>
          <Typography variant="body2" color="text.secondary">Get well soon. For any queries, please contact us.</Typography>
          <Typography variant="caption" color="text.secondary">* This is a computer generated invoice. No signature required.</Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", gap: 2 }} className="print:hidden">
        <Button variant="outlined" onClick={handlePrint} disabled={billItems.length === 0}>Print Bill</Button>
        <Button variant="contained" onClick={generateBill} disabled={billItems.length === 0 || isGenerating}>
          {isGenerating ? "Generating..." : "Generate Bill"}
        </Button>
      </Box>
    </Paper>
  );
};

export default BillingInterface;
