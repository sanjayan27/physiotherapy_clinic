import React, { useContext, useEffect, useState } from "react";
import { User, Phone, Mail, Calendar, Plus, FileText, Upload, Heart, Sparkles } from "lucide-react";
import { AppContext } from "@/app/context/AppContext";
import { AxiosToastError, AxiosToastSuccess } from "@/app/utils/AxiosToastSended";
import { BsExclamationCircleFill } from "react-icons/bs";
import { bookAppointment, getUserDetails } from "@/app/services/patientAppointmentBooking.service";
import { Box, Paper, Stack, Typography, TextField, Select, MenuItem, Button, Checkbox, FormControlLabel, IconButton } from "@mui/material";

interface DocumentItem { file: File | null; note: string }
interface FormState {
  fullName: string;
  phoneNumber: string;
  email: string;
  concerns: string;
  additionalNotes: string;
  documents: DocumentItem[];
}

const initialFormData: FormState = {
  fullName: "",
  phoneNumber: "",
  email: "",
  concerns: "",
  additionalNotes: "",
  documents: [{ file: null, note: "" }],
};

interface PatientInformationFormProps {
  existingUser: boolean;
  setExistingUser: (v: boolean) => void;
}

export default function PatientInformationForm({ existingUser, setExistingUser }: PatientInformationFormProps) {
  const [formData, setFormData] = useState<FormState>(initialFormData);
  const ctx: any = useContext(AppContext as any);
  const { formRefForScroll, selectedDate, selectedSlots , userList } = ctx || {};

  const [focusedField, setFocusedField] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toggleFollowUp, setToggleFollowUp] = useState<boolean>(false);

  // ---------------- Handlers ----------------
  const handleInputChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (index: number, field: keyof DocumentItem, value: any) => {
    const newDocuments = [...formData.documents];
    (newDocuments[index] as any)[field] = value;
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
  };

  const addDocumentField = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { file: null, note: "" }],
    }));
  };

  // ---------------- API Calls ----------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!existingUser && formData.concerns === "Other") {
      const hasAtLeastOneFile = formData.documents.some((doc) => doc.file);
      if (!hasAtLeastOneFile) {
        alert("Please upload at least one medical document.");
        return;
      }
      const fileWithEmptyNote = formData.documents.find(
        (doc) => doc.file && !doc.note
      );
      if (fileWithEmptyNote) {
        alert("Please provide a note for each uploaded document.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Build payload
      const payload = new FormData();
      payload.append("name", formData.fullName);
      payload.append("phone_number", formData.phoneNumber);
      payload.append("email", formData.email);
      payload.append("concerns", formData.concerns);
      payload.append("additional_notes", formData.additionalNotes);
      payload.append("appointmentDate", selectedDate);
      payload.append("appointmentSlot", selectedSlots);

      if (!existingUser && formData.concerns === "Other") {
        formData.documents.forEach((doc) => {
          if (doc.file && doc.note) {
            payload.append("document_files", doc.file);
            payload.append("document_notes", doc.note);
          }
        });
      }
      console.log("appointmentDate", selectedDate);
      console.log("appointmentSlot", selectedSlots);
      // ✅ Use service instead of Axios directly
      const response: any = await bookAppointment(payload);

      if (response?.success) {
        AxiosToastSuccess({ data: { message: "Successfully booked your appointment" } });
        setFormData(initialFormData);
      } else {
        AxiosToastError({ data: { message: response?.message || "There was an issue booking your appointment. Please try again." } });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      AxiosToastError({
        data: {
          message:
            error?.response?.data?.message ||
            "An error occurred while booking your appointment. Please try again later.",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const forUserList = async(user:any)=>{
    if(user){
      setFormData((prev) => ({
          ...prev,
          fullName: user.name || "",
          phoneNumber: user.phoneNumber || "",
          email: user.email || ""
        }));
    }
  }

  const checkUser = () => {
    if (formData.concerns && formData.concerns !== "Other") {
      setExistingUser(true);
    } else {
      setExistingUser(false);
    }
  };

  const fetchUserData = async () => {
    try {
      // ✅ Use service instead of Axios directly
      const response = await getUserDetails();

      if (response) {
        setFormData((prev) => ({
          ...prev,
          fullName: response.name || "",
          phoneNumber: response.phone_number || "",
          email: response.email || "",
          concerns: response.appointments?.[0]?.concerns || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // ---------------- Effects ----------------
  useEffect(() => {
    checkUser();
  }, [formData.concerns]);

  const checkingFollowUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToggleFollowUp(e.target.checked);
    if (e.target.checked) {
      fetchUserData();
    } else {
      setFormData(initialFormData);
    }
  };

  useEffect(() => {
    if (toggleFollowUp) {
      fetchUserData();
    }
  }, [toggleFollowUp]);
  useEffect(()=>{
    if(userList){
      forUserList(userList)
    }
  },[userList])

  // ---------------- UI ----------------
  const conditionOptions = [
    "Back Pain",
    "Neck Pain",
    "Knee Injury",
    "Sports Injury",
    "Post-Surgery Recovery",
    "Arthritis",
    "Shoulder Pain",
    "Headaches",
    "Other",
  ];
  console.log('userList',userList)

  return (
    <Box ref={formRefForScroll} sx={{ minHeight: "100vh", p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ borderRadius: 3, overflow: "hidden" }} elevation={3}>
          {existingUser && selectedDate && selectedSlots && (
            <Box sx={{ px: 3, py: 2, color: "primary.contrastText", background: (t) => `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.secondary.main})` }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
                <Calendar size={18} />
                <Typography fontWeight={600}>
                  Selected Appointment: {selectedDate} at {selectedSlots}
                </Typography>
                <Sparkles size={18} />
              </Stack>
            </Box>
          )}

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 4, py: 2, borderBottom: 1, borderColor: "divider" }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ p: 1, borderRadius: 2, bgcolor: "secondary.light", color: "secondary.main" }}>
                <User size={20} />
              </Box>
              <Typography variant="h5" fontWeight={700}>Patient Information</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <FormControlLabel
                control={<Checkbox checked={toggleFollowUp} onChange={checkingFollowUp} />}
                label={<Typography>Follow Up</Typography>}
              />
              <Box sx={{ position: "relative" }}>
                <Typography variant="caption" sx={{ cursor: "help" }}>
                  <BsExclamationCircleFill />
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Box sx={{ p: 4 }}>
            <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ mb: 2 }}>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Full Name *</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled
                />
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Phone Number *</Typography>
                <TextField
                  fullWidth
                  placeholder="00000 00000"
                  inputProps={{ maxLength: 10, inputMode: "numeric" }}
                  value={formData.phoneNumber}
                  disabled
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ mb: 2 }}>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Email Address</Typography>
                <TextField
                  fullWidth
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={formData.email}
                  disabled
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">Medical Concerns *</Typography>
                <Select
                  fullWidth
                  displayEmpty
                  value={formData.concerns}
                  onChange={(e) => handleInputChange("concerns", e.target.value as string)}
                >
                  <MenuItem value=""><em>Select your condition</em></MenuItem>
                  {conditionOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Stack>

            {!existingUser && formData.concerns === "Other" && (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Upload size={16} />
                    <Typography variant="body2">Upload Medical Documents <Typography component="span" color="error.main">*</Typography></Typography>
                  </Stack>
                  <IconButton color="secondary" onClick={addDocumentField} aria-label="Add another document">
                    <Plus size={16} />
                  </IconButton>
                </Stack>

                {formData.documents.map((doc, index) => (
                  <Box key={index} sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 2, bgcolor: "background.paper", mb: 2 }}>
                    <Box sx={{ position: "relative", border: 2, borderStyle: "dashed", borderColor: doc.file ? "secondary.main" : "divider", borderRadius: 2, p: 2, textAlign: "center", mb: 1 }}>
                      <input
                        type="file"
                        onChange={(e) => handleDocumentChange(index, "file", (e.target.files && e.target.files[0]) || null)}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <Upload style={{ margin: "0 auto" }} />
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {doc.file ? `Selected: ${doc.file.name}` : "Click to upload or drag and drop"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">PDF, DOC, JPG, PNG up to 10MB</Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary">Note for this document *</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g., X-ray from last month"
                      value={doc.note}
                      onChange={(e) => handleDocumentChange(index, "note", e.target.value)}
                    />
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FileText size={16} />
                <Typography variant="body2">Additional Notes <Typography component="span" color="text.secondary">(optional)</Typography></Typography>
              </Stack>
              <TextField
                fullWidth
                multiline
                minRows={4}
                placeholder="Please share any additional information about your condition or specific requirements..."
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
              />
            </Box>

            <Button
              type="submit"
              onClick={(e) => handleSubmit(e as any)}
              disabled={isSubmitting}
              variant="contained"
              fullWidth
              sx={{ py: 2 }}
            >
              {isSubmitting ? (
                <Typography>Processing Your Request...</Typography>
              ) : (
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                  <Sparkles size={16} />
                  <Calendar className="w-5 h-5" />
                  Confirm Your Appointment
                </Stack>
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box textAlign="center" mt={4}>
        <Typography variant="caption" color="text.secondary">
          Your information is secure and protected. We respect your privacy.
        </Typography>
      </Box>
    </Box>
  );
}
