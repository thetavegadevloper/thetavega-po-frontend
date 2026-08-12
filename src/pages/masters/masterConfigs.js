// =====================================================
// SMART ADDRESS FIELDS
//
// Used for:
// 1. Company
// 2. Vendor
// 3. Delivery Address
//
// FLOW:
// State
//   ↓
// City
//   ↓
// Area / Post Office
//   ↓
// District / Pincode / State Code / Country AUTO
// =====================================================
const smartAddressFields = [
  {
    name: "registeredAddress.line1",
    label: "Address Line 1",
    required: true,
    col: 12
  },

  {
    name: "registeredAddress.line2",
    label: "Address Line 2",
    col: 12
  },

  {
    name: "registeredAddress.state",
    label: "State",
    required: true
  },

  {
    name: "registeredAddress.stateCode",
    label: "State Code"
  },

  {
    name: "registeredAddress.city",
    label: "City",
    required: true
  },

  {
    name: "registeredAddress.district",
    label: "District",
    required: true
  },

  {
    name: "registeredAddress.pincode",
    label: "Pincode",
    required: true
  },

  {
    name: "registeredAddress.country",
    label: "Country",
    defaultValue: "India"
  }
];

// =====================================================
// NORMAL ADDRESS FIELDS
//
// Keep available in case another master later needs
// completely manual address entry.
// =====================================================
const addressFields = [
  {
    name: "registeredAddress.line1",
    label: "Address Line 1",
    required: true,
    col: 12
  },

  {
    name: "registeredAddress.line2",
    label: "Address Line 2",
    col: 12
  },

  {
    name: "registeredAddress.city",
    label: "City",
    required: true
  },

  {
    name: "registeredAddress.district",
    label: "District"
  },

  {
    name: "registeredAddress.state",
    label: "State",
    required: true
  },

  {
    name: "registeredAddress.stateCode",
    label: "State Code"
  },

  {
    name: "registeredAddress.pincode",
    label: "Pincode",
    required: true
  },

  {
    name: "registeredAddress.country",
    label: "Country",
    defaultValue: "India"
  }
];

// =====================================================
// MASTER CONFIGURATION
// =====================================================
export const MASTER_CONFIGS = {
  // ===================================================
  // COMPANY MASTER
  // ===================================================
  companies: {
    title: "Company Master",

    singular: "Company",

    endpoint: "/companies",

    readPermission: "company.read",

    writePermission: "company.write",

    searchPlaceholder:
      "Company name, code or GSTIN",

    // =================================================
    // AUTO COMPANY CODE
    //
    // Example:
    // CMP01
    // CMP02
    // CMP03
    // =================================================
    autoCode: {
      enabled: true,
      field: "companyCode"
    },

    // =================================================
    // ENABLE COMMON GST AUTO-FILL
    // =================================================
    gstAutoFill: {
      enabled: true,

      // GST field in Company
      gstField: "gstin",

      // PAN field in Company
      panField: "pan",

      // Company's top-level GST state fields
      gstStateField: "gstState",

      gstStateCodeField: "stateCode",

      // Also update registered address
      addressStateField:
        "registeredAddress.state",

      addressStateCodeField:
        "registeredAddress.stateCode"
    },

    // =================================================
    // ENABLE COMMON SMART ADDRESS
    // =================================================
    addressAutoFill: true,

    columns: [
      [
        "companyCode",
        "Code"
      ],

      [
        "companyName",
        "Company Name"
      ],

      [
        "gstin",
        "GSTIN"
      ],

      [
        "gstState",
        "GST State"
      ],

      [
        "contactNo",
        "Contact"
      ]
    ],

    fields: [
      {
        name: "companyCode",
        label: "Company Code",
        required: true
      },

      {
        name: "companyName",
        label: "Company Name",
        required: true
      },

      {
        name: "gstin",
        label: "GSTIN",
        required: true
      },

      {
        name: "pan",
        label: "PAN",
        required: true
      },

      {
        name: "cin",
        label: "CIN"
      },

      {
        name: "stateCode",
        label: "GST State Code",
        required: true
      },

      {
        name: "gstState",
        label: "GST State",
        required: true
      },

      {
        name: "contactNo",
        label: "Contact No"
      },

      {
        name: "email",
        label: "Email",
        type: "email"
      },

      {
        name: "website",
        label: "Website"
      },

      // =================================================
      // SMART ADDRESS
      // =================================================
      ...smartAddressFields,

      {
        name: "bankDetails.bankName",
        label: "Bank Name"
      },

      {
        name: "bankDetails.accountNo",
        label: "Bank Account No"
      },

      {
        name: "bankDetails.ifsc",
        label: "IFSC"
      },

      {
        name: "bankDetails.branch",
        label: "Bank Branch"
      },

      {
        name: "bankDetails.bankAddress",
        label: "Bank Address",
        col: 12
      },

      {
        name: "authorizedSignatoryText",
        label: "Authorized Signatory Text",
        col: 12
      }
    ],

    initial: {
      registeredAddress: {
        country: "India"
      },

      bankDetails: {},

      isActive: true
    }
  },

  // ===================================================
  // VENDOR MASTER
  // ===================================================
  vendors: {
    title: "Vendor Master",

    singular: "Vendor",

    endpoint: "/vendors",

    readPermission: "vendor.read",

    writePermission: "vendor.write",

    searchPlaceholder:
      "Vendor name, code or GST",

    // =================================================
    // AUTO VENDOR CODE
    //
    // Example:
    // TT01
    // TT02
    // TT03
    // =================================================
    autoCode: {
      enabled: true,
      field: "vendorCode"
    },

    // =================================================
    // ENABLE SAME GST AUTO-FILL
    // =================================================
    gstAutoFill: {
      enabled: true,

      gstField: "gstNo",

      panField: "panNo",

      // Vendor currently has no separate top-level
      // gstState / gstStateCode fields.
      gstStateField: null,

      gstStateCodeField: null,

      addressStateField:
        "registeredAddress.state",

      addressStateCodeField:
        "registeredAddress.stateCode"
    },

    // =================================================
    // SAME SMART ADDRESS LOGIC
    // =================================================
    addressAutoFill: true,

    // =================================================
    // VENDOR MASTER TABLE
    // =================================================
    columns: [
      [
        "vendorCode",
        "Code"
      ],

      [
        "vendorName",
        "Vendor"
      ],

      [
        "purchaseType",
        "Purchase Type"
      ],

      [
        "gstNo",
        "GST No"
      ],

      [
        "panNo",
        "PAN No"
      ],

      [
        "gstCertificate.originalName",
        "GST Certificate"
      ],

      [
        "panCard.originalName",
        "PAN Card"
      ],

      [
        "supportingFiles",
        "Supporting Files"
      ],

      [
        "currency",
        "Currency"
      ]
    ],

    // =================================================
    // ADD / EDIT VENDOR FORM
    // =================================================
    fields: [
      {
        name: "vendorCode",
        label: "Vendor Code",
        required: true
      },

      {
        name: "vendorName",
        label: "Vendor Name",
        required: true
      },

      {
        name: "purchaseType",
        label: "Purchase Type",
        type: "select",

        options: [
          "Domestic",
          "Import"
        ],

        required: true
      },

      {
        name: "currency",
        label: "Currency",
        required: true
      },

      // =================================================
      // GST DETAILS
      // =================================================
      {
        name: "gstNo",
        label: "GST No"
      },

      {
        name: "gstCertificate",
        label: "GST Certificate",
        type: "file",
        accept:
          ".pdf,.jpg,.jpeg,.png"
      },

      // =================================================
      // PAN DETAILS
      // =================================================
      {
        name: "panNo",
        label: "PAN No"
      },

      {
        name: "panCard",
        label: "PAN Card",
        type: "file",
        accept:
          ".pdf,.jpg,.jpeg,.png"
      },

      // =================================================
      // SUPPORTING FILES
      // =================================================
      {
        name: "supportingFiles",
        label: "Supporting Files",
        type: "file",
        multiple: true,
        accept:
          ".pdf,.jpg,.jpeg,.png,.xls,.xlsx",
        col: 12
      },

      // =================================================
      // SMART ADDRESS
      //
      // State -> City -> Area -> PIN
      // =================================================
      ...smartAddressFields,

      // =================================================
      // BANK DETAILS
      // =================================================
      {
        name: "bankName",
        label: "Bank Name"
      },

      {
        name: "accountNo",
        label: "Account No"
      },

      {
        name: "ifsc",
        label: "IFSC"
      },

      {
        name: "bankAddress",
        label: "Bank Address",
        col: 12
      },

      // =================================================
      // PRIMARY CONTACT
      // =================================================
      {
        name: "contacts.0.type",
        label: "Primary Contact Type",
        type: "select",

        options: [
          "Sales",
          "Service",
          "Logistics",
          "Support",
          "Accounts",
          "Management",
          "Other"
        ]
      },

      {
        name: "contacts.0.name",
        label: "Primary Contact Name"
      },

      {
        name: "contacts.0.phone",
        label: "Primary Contact Phone"
      },

      {
        name: "contacts.0.email",
        label: "Primary Contact Email",
        type: "email"
      }
    ],

    // =================================================
    // INITIAL VALUES
    // =================================================
    initial: {
      purchaseType: "Domestic",

      currency: "INR",

      gstNo: "",

      gstCertificate: null,

      panNo: "",

      panCard: null,

      supportingFiles: [],

      registeredAddress: {
        country: "India"
      },

      contacts: [
        {
          type: "Sales",
          name: "",
          phone: "",
          email: ""
        }
      ],

      isActive: true
    },

    // =================================================
    // CLEAN BEFORE SAVE
    // =================================================
    clean: (data) => ({
      ...data,

      contacts:
        data.contacts?.[0]?.name
          ? data.contacts
          : []
    })
  },

  // ===================================================
  // MATERIAL MASTER
  // ===================================================
  materials: {
    title: "Material Master",

    singular: "Material",

    endpoint: "/materials",

    readPermission: "material.read",

    writePermission: "material.write",

    searchPlaceholder:
      "Item code, description, make or model",

    // =================================================
    // AUTO MATERIAL CODE
    //
    // Example:
    // MAT001
    // MAT002
    // MAT003
    // =================================================
    autoCode: {
      enabled: true,
      field: "itemCode"
    },

    columns: [
      [
        "itemCode",
        "Item Code"
      ],

      [
        "description",
        "Description"
      ],

      [
        "uom",
        "UOM"
      ],

      [
        "itemType",
        "Type"
      ],

      [
        "hsnSacCode",
        "HSN/SAC"
      ],

      [
        "gstPercent",
        "GST %"
      ],

      [
        "rate",
        "Rate"
      ]
    ],

    fields: [
      {
        name: "itemCode",
        label: "Item Code",
        required: true
      },

      {
        name: "description",
        label: "Description",
        required: true,
        col: 12,
        type: "textarea"
      },

      {
        name: "make",
        label: "Make"
      },

      {
        name: "model",
        label: "Model"
      },

     {
  name: "uom",
  label: "UOM",
  type: "select",
  options: [
    "Nos",
    "Pcs",
    "Set",
    "Pair",
    "Lot",
    "Kg",
    "Gram",
    "Litre",
    "ML",
    "Meter",
    "MM",
    "CM",
    "Sq. Meter",
    "Cu. Meter",
    "Box",
    "Packet",
    "Roll",
    "Bundle",
    "Dozen",
    "Hour",
    "Day",
    "Job"
  ],
  required: true
},

      {
        name: "itemType",
        label: "Item Type",
        type: "select",

        options: [
          "Service",
          "Goods",
          "Goods + Service"
        ],

        required: true
      },

      {
        name: "hsnSacCode",
        label: "HSN / SAC Code"
      },

      {
        name: "gstPercent",
        label: "GST %",
        type: "number",
        step: "0.01"
      },

      {
        name: "tdsPercent",
        label: "TDS %",
        type: "number",
        step: "0.01"
      },

      {
        name: "rate",
        label: "Rate",
        type: "number",
        step: "0.01",
        required: true
      },

      {
        name: "specification",
        label: "Specification",
        type: "textarea",
        col: 12
      }
    ],

    initial: {
      itemType: "Goods",

      gstPercent: 0,

      tdsPercent: 0,

      rate: 0,

      isActive: true
    }
  },

  // ===================================================
  // PROJECT MASTER
  // ===================================================
  projects: {
    title:
      "Project Master",

    singular:
      "Project",

    endpoint:
      "/projects",

    readPermission:
      "project.read",

    writePermission:
      "project.write",

    searchPlaceholder:
      "Project code, project or customer",

    // =================================================
    // AUTO PROJECT CODE
    //
    // Example:
    // PRJ01
    // PRJ02
    // =================================================
    autoCode: {
      enabled: true,
      field: "projectCode"
    },

    columns: [
      [
        "projectCode",
        "Project Code"
      ],

      [
        "projectName",
        "Project Name"
      ],

      [
        "customerName",
        "Customer"
      ],

      [
        "location",
        "Location"
      ],

      [
        "budget",
        "Budget"
      ]
    ],

    fields: [
      {
        name:
          "projectCode",

        label:
          "Project Code",

        required:
          true
      },

      {
        name:
          "projectName",

        label:
          "Project Name",

        required:
          true
      },

      {
        name:
          "customerName",

        label:
          "Customer Name",

        required:
          true
      },

      {
        name:
          "location",

        label:
          "Location"
      },

      {
        name:
          "budget",

        label:
          "Budget",

        type:
          "number",

        step:
          "0.01"
      },

      {
        name:
          "projectDocumentNo",

        label:
          "Project Document No"
      },

      {
        name:
          "application",

        label:
          "Application",

        col:
          12,

        type:
          "textarea"
      },

      {
        name:
          "projectDescription",

        label:
          "Project Description",

        col:
          12,

        type:
          "textarea"
      }
    ],

    initial: {
      budget:
        0,

      isActive:
        true
    }
  },

  // ===================================================
  // COST CENTER
  // ===================================================
  "cost-centers": {
    title:
      "Cost Center Master",

    singular:
      "Cost Center",

    endpoint:
      "/cost-centers",

    readPermission:
      "cost_center.read",

    writePermission:
      "cost_center.write",

    searchPlaceholder:
      "Cost center code or name",

    // =================================================
    // AUTO COST CENTER CODE
    //
    // Example:
    // CC01
    // CC02
    // =================================================
    autoCode: {
      enabled: true,
      field: "costCenterCode"
    },

    columns: [
      [
        "costCenterCode",
        "Code"
      ],

      [
        "costCenterName",
        "Cost Center"
      ],

      [
        "type",
        "Type"
      ],

      [
        "description",
        "Description"
      ]
    ],

    fields: [
      {
        name:
          "costCenterCode",

        label:
          "Cost Center Code",

        required:
          true
      },

      {
        name:
          "costCenterName",

        label:
          "Cost Center Name",

        required:
          true
      },

      {
        name:
          "type",

        label:
          "Type",

        type:
          "select",

        options: [
          "Service",
          "Manufacturing",
          "Trading"
        ],

        required:
          true
      },

      {
        name:
          "description",

        label:
          "Description",

        col:
          12,

        type:
          "textarea"
      }
    ],

    initial: {
      type:
        "Manufacturing",

      isActive:
        true
    }
  },

  // ===================================================
  // DELIVERY ADDRESS
  // ===================================================
  "delivery-addresses": {
    title:
      "Delivery Address",

    singular:
      "Delivery Address",

    endpoint:
      "/delivery-addresses",

    readPermission:
      "delivery.read",

    writePermission:
      "delivery.write",

    searchPlaceholder:
      "Delivery code, name or store person",

    // =================================================
    // AUTO DELIVERY CODE
    //
    // Example:
    // DEL01
    // DEL02
    // =================================================
    autoCode: {
      enabled: true,
      field: "deliveryCode"
    },

    // =================================================
    // GST AUTO-FILL
    // =================================================
    gstAutoFill: {
      enabled:
        true,

      gstField:
        "gstNo",

      panField:
        "panNo",

      gstStateField:
        null,

      gstStateCodeField:
        null,

      addressStateField:
        "registeredAddress.state",

      addressStateCodeField:
        "registeredAddress.stateCode"
    },

    // =================================================
    // SAME ADDRESS AUTO-FILL
    // =================================================
    addressAutoFill:
      true,

    columns: [
      [
        "deliveryCode",
        "Code"
      ],

      [
        "name",
        "Name"
      ],

      [
        "storePersonName",
        "Store Person"
      ],

      [
        "storeContactNo",
        "Contact"
      ],

      [
        "email",
        "Email"
      ]
    ],

    fields: [
      {
        name:
          "deliveryCode",

        label:
          "Delivery Code",

        required:
          true
      },

      {
        name:
          "name",

        label:
          "Name",

        required:
          true
      },

      // =================================================
      // GST BEFORE ADDRESS
      // =================================================
      {
        name:
          "gstNo",

        label:
          "GST No"
      },

      {
        name:
          "panNo",

        label:
          "PAN No"
      },

      // =================================================
      // SMART ADDRESS
      // =================================================
      ...smartAddressFields,

      {
        name:
          "landmark",

        label:
          "Landmark",

        col:
          12
      },

      {
        name:
          "storePersonName",

        label:
          "Store Contact Person"
      },

      {
        name:
          "storeContactNo",

        label:
          "Store Contact No"
      },

      {
        name:
          "email",

        label:
          "Email",

        type:
          "email"
      }
    ],

    initial: {
      gstNo:
        "",

      panNo:
        "",

      registeredAddress: {
        country:
          "India"
      },

      isActive:
        true
    }
  },

  // ===================================================
  // PAYMENT TERMS
  // ===================================================
  "payment-terms": {
    title:
      "Payment Terms Master",

    singular:
      "Payment Term",

    endpoint:
      "/payment-terms",

    readPermission:
      "payment.read",

    writePermission:
      "payment.write",

    searchPlaceholder:
      "Payment code, name or summary",

    // =================================================
    // AUTO PAYMENT CODE
    //
    // Example:
    // PAY01
    // PAY02
    // =================================================
    autoCode: {
      enabled: true,
      field: "paymentCode"
    },

    columns: [
      [
        "paymentCode",
        "Code"
      ],

      [
        "paymentName",
        "Payment Term"
      ],

      [
        "paymentSummary",
        "Payment Summary"
      ],

      [
        "displayOrder",
        "Order"
      ]
    ],

    fields: [
      {
        name:
          "paymentCode",

        label:
          "Payment Code",

        required:
          true
      },

      {
        name:
          "paymentName",

        label:
          "Payment Term Name",

        required:
          true
      },

      {
        name:
          "paymentSummary",

        label:
          "Payment Summary",

        type:
          "textarea",

        col:
          12,

        rows:
          3,

        required:
          true
      },

      {
        name:
          "description",

        label:
          "Description",

        type:
          "textarea",

        col:
          12
      },

      {
        name:
          "displayOrder",

        label:
          "Display Order",

        type:
          "number",

        required:
          true
      }
    ],

    initial: {
      paymentCode:
        "",

      paymentName:
        "",

      paymentSummary:
        "",

      description:
        "",

      displayOrder:
        1,

      isActive:
        true
    }
  },

  // ===================================================
  // PO TERMS
  // ===================================================
  "po-terms": {
    title:
      "PO Terms Master",

    singular:
      "PO Term",

    endpoint:
      "/po-terms",

    readPermission:
      "term.read",

    writePermission:
      "term.write",

    searchPlaceholder:
      "Term code, title or text",

    // =================================================
    // AUTO TERM CODE
    //
    // Example:
    // TERM01
    // TERM02
    // =================================================
    autoCode: {
      enabled: true,
      field: "termCode"
    },

    columns: [
      [
        "termCode",
        "Code"
      ],

      [
        "scope",
        "Scope"
      ],

      [
        "category",
        "Category"
      ],

      [
        "title",
        "Title"
      ],

      [
        "displayOrder",
        "Order"
      ]
    ],

    fields: [
      {
        name:
          "termCode",

        label:
          "Term Code",

        required:
          true
      },

      {
        name:
          "scope",

        label:
          "Scope",

        type:
          "select",

        options: [
          "Specific",
          "General"
        ],

        required:
          true
      },

      {
        name:
          "category",

        label:
          "Category",

        type:
          "select",

        options: [
          "Application",
          "Packing",
          "Freight",
          "Delivery",
          "Payment",
          "Warranty",
          "Service",
          "Technical",
          "Documentation",
          "Certification",
          "Training",
          "Special",
          "General"
        ]
      },

      {
        name:
          "title",

        label:
          "Title",

        required:
          true
      },

      {
        name:
          "displayOrder",

        label:
          "Display Order",

        type:
          "number",

        required:
          true
      },

      {
        name:
          "text",

        label:
          "Term Text",

        type:
          "textarea",

        col:
          12,

        required:
          true,

        rows:
          5
      },

      {
        name:
          "mandatory",

        label:
          "Mandatory",

        type:
          "checkbox"
      },

      {
        name:
          "canOverride",

        label:
          "Can Override",

        type:
          "checkbox"
      },

      {
        name:
          "editablePerPO",

        label:
          "Editable per PO",

        type:
          "checkbox"
      }
    ],

    initial: {
      scope:
        "Specific",

      category:
        "General",

      displayOrder:
        1,

      mandatory:
        true,

      canOverride:
        true,

      editablePerPO:
        false,

      isActive:
        true
    }
  }
};