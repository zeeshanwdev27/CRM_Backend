import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    company: {
      type: String,
      required: [true, "Contact person name is required"],
    },
    projects: {
      type: [String], // Now this is an array of strings
      required: [true, "Projects are required"],
      default: [],
      validate: {
        validator: function (v) {
          return v.length > 0; // At least one project required
        },
        message: () => "At least one project is required",
      },
    },
    value: {
      type: String, // Stored as string like "$4,250" to match frontend
      required: [true, "Project value is required"],
      default: "$0",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "inactive"],
      default: "active",
    },
    lastContact: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
