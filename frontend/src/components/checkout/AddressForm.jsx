import Input from "../ui/Input";
import "./AddressForm.css";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Lakshadweep", "Puducherry"
];

const AddressForm = ({ formData, errors, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="address-form">
      <h2 className="af-title">Shipping Address</h2>

      <div className="af-row af-row--2">
        <Input
          id="firstName"
          label="First Name"
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
          error={errors?.firstName}
          required
          placeholder="John"
        />
        <Input
          id="lastName"
          label="Last Name"
          name="lastName"
          value={formData.lastName || ""}
          onChange={handleChange}
          error={errors?.lastName}
          required
          placeholder="Doe"
        />
      </div>

      <Input
        id="address"
        label="Flat, House no., Building, Company, Apartment"
        name="address"
        value={formData.address || ""}
        onChange={handleChange}
        error={errors?.address}
        required
        placeholder="e.g. Flat 101, A-Wing, Royal Residency"
      />

      <Input
        id="apartment"
        label="Area, Colony, Street, Sector, Village (optional)"
        name="apartment"
        value={formData.apartment || ""}
        onChange={handleChange}
        placeholder="e.g. Bandra West, Near Metro Station"
      />

      <div className="af-row af-row--3">
        <Input
          id="city"
          label="City"
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          error={errors?.city}
          required
          placeholder="Mumbai"
        />

        <div className="input-group">
          <label className="input-label" htmlFor="state">
            State <span className="input-required">*</span>
          </label>
          <select
            id="state"
            name="state"
            className={`input-field ${errors?.state ? "input-field--error" : ""}`}
            value={formData.state || ""}
            onChange={handleChange}
          >
            <option value="">Select State / UT</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors?.state && <span className="input-error-msg">{errors.state}</span>}
        </div>

        <Input
          id="zipCode"
          label="PIN Code"
          name="zipCode"
          value={formData.zipCode || ""}
          onChange={handleChange}
          error={errors?.zipCode}
          required
          placeholder="400001"
          maxLength={6}
        />
      </div>

      <Input
        id="phone"
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone || ""}
        onChange={handleChange}
        error={errors?.phone}
        required
        placeholder="10-digit mobile number (e.g. 9876543210)"
        maxLength={10}
      />
    </div>
  );
};

export default AddressForm;
