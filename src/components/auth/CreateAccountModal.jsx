import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Button, Label } from "reactstrap";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VerifyCodeModal from "./VerifyCodeModal";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import axios from "axios"; // For sending HTTP requests
import "./CreateAccountModal.css";
import CountryCodeSelect from "./CountryCodeSelect"; // 引入新的 CountryCodeSelect 组件

const CreateAccountModal = ({ handleBackToLogin }) => {
  const [username, setUsername] = useState(""); // 新增 User Name
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(null); // State for country code
  const [countryCodeError, setCountryCodeError] = useState(""); // 定义 countryCodeError 状态

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [usernameError, setUsernameError] = useState(""); // 新增 User Name 错误
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [alert, setAlert] = useState({
    severity: "",
    message: "",
    open: false,
  });
  const [loading, setLoading] = useState(false); // 添加loading状态

  useEffect(() => {
    setUsername(""); // 清空 User Name
    setCountryCode(null); // 清空 Country Code
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, []);

  // 统一管理Alert展示时间的函数
  const showAlert = (severity, message) => {
    setAlert({ severity, message, open: true });

    // 设置3秒后关闭alert
    setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);
  };

  // User Name validation
  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/; // 字母开头，长度4-20，允许字母、数字和下划线
    return usernameRegex.test(username);
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, with letters and numbers
    return passwordRegex.test(password);
  };

  // Real-time username validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value === "") {
      setUsernameError(""); // No error message if empty
    } else if (!validateUsername(value)) {
      setUsernameError(
        "* Username must be 4-20 characters long, start with a letter, and can only contain letters, numbers, and underscores"
      );
    } else {
      setUsernameError(""); // Clear error
    }
  };

  // Real-time email validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value === "") {
      setEmailError(""); // No error message if empty
    } else if (!validateEmail(value)) {
      setEmailError("* Invalid email format");
    } else {
      setEmailError(""); // Clear error
    }
  };

  // Real-time password validation
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value === "") {
      setPasswordError(""); // No error message if empty
    } else if (!validatePassword(value)) {
      setPasswordError(
        "* Password must be at least 8 characters long and include both letters and numbers"
      );
    } else {
      setPasswordError(""); // Clear error
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("* Passwords do not match");
    } else {
      setConfirmPasswordError(""); // Clear error
    }
  };

  // Check if the form is valid
  const isFormValid = () => {
    return (
      validateUsername(username) && // Validate User Name
      validateEmail(email) &&
      validatePassword(password) &&
      password === confirmPassword
    );
  };

  const sendVerificationCodeWithFeedback = async (email) => {
    setLoading(true); // 显示加载动画
    try {
      const response = await axios.post(`/api/users/send-verification-code?email=${encodeURIComponent(email)}`);

      if (response.data.success) {
        setShowVerifyModal(true); // 显示验证码弹窗
        showAlert("success", "Verification code sent!");
      } else {
        showAlert("error", response.data.errorMsg || "Error sending verification code");
      }
    } catch (error) {
      showAlert("error", "Error sending verification code");
    } finally {
      setLoading(false); // 停止加载动画
    }
  };

  const sendVerificationCodeWithoutFeedback = async (email) => {
    try {
      await axios.post(`/api/users/send-verification-code?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.log("Error sending verification code:", error);
    }
  };

  // Handle sending verification code
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();
    setUsernameError(""); // Clear username error
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!isFormValid()) return;

    await sendVerificationCodeWithFeedback(email);
  };

  const handleVerifyCodeSubmit = (code) => {
    console.log("Received verification code:", code);
    setShowVerifyModal(false);
  };

  const handleBack = (e) => {
    e.preventDefault();
    handleBackToLogin();
  };

  return (
    <div className="form-container">
      {alert.open && (
        <Alert
          severity={alert.severity}
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          {alert.message}
        </Alert>
      )}
      <Form autoComplete="off">
        {/* 新增 User Name 输入框 */}
        <FormGroup className="mb-3">
          <Label for="username">User Name</Label>
          <Input
            type="text"
            id="username"
            placeholder="User Name"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="off"
          />
          {usernameError && <p className="error-message">{usernameError}</p>}
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            autoComplete="off"
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </FormGroup>

        <FormGroup className="mb-3">
        <Label for="countryCode">Country Code</Label>
        <CountryCodeSelect
          value={countryCode}
          onChange={setCountryCode}
        />
        {countryCodeError && <p className="error-message">{countryCodeError}</p>}
      </FormGroup>

        <FormGroup className="mb-3">
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="off"
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
        </FormGroup>

        <FormGroup className="mb-3">
          <Label for="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            autoComplete="off"
          />
          {confirmPasswordError && (
            <p style={{ color: "red" }}>{confirmPasswordError}</p>
          )}
        </FormGroup>

        <div
          className="text-center d-flex justify-content-center align-items-center"
          style={{ marginTop: "40px" }}
        >
          <Button
            className="text-primary"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "black",
              display: "inline-flex",
              alignItems: "center",
            }}
            onClick={handleBack}
          >
            <ArrowBackIosIcon /> Back to Login
          </Button>

          <div style={{ marginRight: "50px" }}></div>

          {loading ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              style={{
                backgroundColor: "#fbcd0b",
                borderColor: "#fbcd0b",
                fontWeight: "bold",
              }}
              className="btn-block"
              onClick={handleSendVerificationCode}
              disabled={!isFormValid()} // Button is disabled if form is not valid
            >
              Send Verification Code
            </Button>
          )}
        </div>
      </Form>

      <VerifyCodeModal
        isOpen={showVerifyModal}
        toggle={() => setShowVerifyModal(false)}
        email={email}
        onSubmit={handleVerifyCodeSubmit}
        sendVerificationCode={sendVerificationCodeWithoutFeedback} // 传递简化版的发送逻辑
      />
    </div>
  );
};

export default CreateAccountModal;