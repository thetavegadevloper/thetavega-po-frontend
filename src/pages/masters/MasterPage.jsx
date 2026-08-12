import { useState } from "react";

import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Table
} from "react-bootstrap";

import toast from "react-hot-toast";

import { masterApi } from "../../api/masterApi";

import http, {
  API_BASE_URL
} from "../../api/http";

import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import EmptyState from "../../components/common/EmptyState";
import PaginationBar from "../../components/common/PaginationBar";
import PermissionGate from "../../components/auth/PermissionGate";

import { getApiError } from "../../utils/error";

import {
  getByPath,
  setByPath
} from "../../utils/object";

// =====================================================
// BACKEND BASE URL
// =====================================================
const BACKEND_BASE_URL =
  API_BASE_URL.replace(
    /\/api\/?$/,
    ""
  );

// =====================================================
// INDIA STATE OPTIONS
// =====================================================
const INDIA_STATE_OPTIONS = [
  {
    code: "01",
    name: "Jammu and Kashmir"
  },
  {
    code: "02",
    name: "Himachal Pradesh"
  },
  {
    code: "03",
    name: "Punjab"
  },
  {
    code: "04",
    name: "Chandigarh"
  },
  {
    code: "05",
    name: "Uttarakhand"
  },
  {
    code: "06",
    name: "Haryana"
  },
  {
    code: "07",
    name: "Delhi"
  },
  {
    code: "08",
    name: "Rajasthan"
  },
  {
    code: "09",
    name: "Uttar Pradesh"
  },
  {
    code: "10",
    name: "Bihar"
  },
  {
    code: "11",
    name: "Sikkim"
  },
  {
    code: "12",
    name: "Arunachal Pradesh"
  },
  {
    code: "13",
    name: "Nagaland"
  },
  {
    code: "14",
    name: "Manipur"
  },
  {
    code: "15",
    name: "Mizoram"
  },
  {
    code: "16",
    name: "Tripura"
  },
  {
    code: "17",
    name: "Meghalaya"
  },
  {
    code: "18",
    name: "Assam"
  },
  {
    code: "19",
    name: "West Bengal"
  },
  {
    code: "20",
    name: "Jharkhand"
  },
  {
    code: "21",
    name: "Odisha"
  },
  {
    code: "22",
    name: "Chhattisgarh"
  },
  {
    code: "23",
    name: "Madhya Pradesh"
  },
  {
    code: "24",
    name: "Gujarat"
  },
  {
    code: "25",
    name: "Daman and Diu"
  },
  {
    code: "26",
    name: "Dadra and Nagar Haveli and Daman and Diu"
  },
  {
    code: "27",
    name: "Maharashtra"
  },
  {
    code: "29",
    name: "Karnataka"
  },
  {
    code: "30",
    name: "Goa"
  },
  {
    code: "31",
    name: "Lakshadweep"
  },
  {
    code: "32",
    name: "Kerala"
  },
  {
    code: "33",
    name: "Tamil Nadu"
  },
  {
    code: "34",
    name: "Puducherry"
  },
  {
    code: "35",
    name: "Andaman and Nicobar Islands"
  },
  {
    code: "36",
    name: "Telangana"
  },
  {
    code: "37",
    name: "Andhra Pradesh"
  },
  {
    code: "38",
    name: "Ladakh"
  }
];

// =====================================================
// CHECK FILE
// =====================================================
function isFile(value) {
  return (
    typeof File !== "undefined" &&
    value instanceof File
  );
}

// =====================================================
// ATTACHMENT URL
// =====================================================
function getAttachmentUrl(file) {
  if (!file) {
    return "";
  }

  const url =
    file.url || "";

  if (!url) {
    return "";
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${BACKEND_BASE_URL}${
    url.startsWith("/")
      ? url
      : `/${url}`
  }`;
}

// =====================================================
// VIEW FILE
// =====================================================
function ViewFileLink({
  file,
  showName = true
}) {
  if (!file) {
    return "-";
  }

  const fileName =
    file.originalName ||
    file.fileName ||
    "";

  const url =
    getAttachmentUrl(
      file
    );

  if (!url) {
    return (
      <span>
        {fileName || "-"}
      </span>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">

      {showName && (
        <span>
          {fileName}
        </span>
      )}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-sm btn-outline-primary"
      >
        <i className="bi bi-eye me-1" />

        View
      </a>

    </div>
  );
}

// =====================================================
// GENERIC FIELD
// =====================================================
function Field({
  field,
  value,
  onChange
}) {
  // ===================================================
  // FILE
  // ===================================================
  if (
    field.type === "file"
  ) {
    return (
      <>
        <Form.Control
          type="file"
          accept={
            field.accept
          }
          multiple={Boolean(
            field.multiple
          )}
          onChange={(
            event
          ) => {
            const files =
              Array.from(
                event.target.files ||
                  []
              );

            if (
              field.multiple
            ) {
              onChange(
                files
              );
            } else {
              onChange(
                files[0] ||
                  null
              );
            }
          }}
        />

        {!field.multiple &&
          value &&
          !isFile(
            value
          ) &&
          value?.originalName && (
            <div className="mt-2">

              <div className="small text-secondary mb-1">
                Current file:
              </div>

              <ViewFileLink
                file={
                  value
                }
              />

            </div>
          )}

        {!field.multiple &&
          isFile(
            value
          ) && (
            <div className="small text-primary mt-1">

              Selected:{" "}

              <strong>
                {
                  value.name
                }
              </strong>

            </div>
          )}

        {field.multiple &&
          Array.isArray(
            value
          ) &&
          value.length >
            0 && (
            <div className="mt-2">

              {value.map(
                (
                  file,
                  index
                ) => (
                  <div
                    key={
                      file?.fileName ||
                      file?.name ||
                      file?.originalName ||
                      index
                    }
                    className="mb-2"
                  >

                    {isFile(
                      file
                    ) ? (
                      <div className="small text-primary">

                        Selected:{" "}

                        <strong>
                          {
                            file.name
                          }
                        </strong>

                      </div>
                    ) : (
                      <ViewFileLink
                        file={
                          file
                        }
                      />
                    )}

                  </div>
                )
              )}

            </div>
          )}
      </>
    );
  }

  // ===================================================
  // COMMON INPUT PROPS
  // ===================================================
  const common = {
    value:
      field.type ===
      "checkbox"
        ? undefined
        : value ?? "",

    checked:
      field.type ===
      "checkbox"
        ? Boolean(
            value
          )
        : undefined,

    required:
      field.required,

    readOnly:
      field.readOnly,

    disabled:
      field.disabled,

    onChange: (
      event
    ) => {
      let next;

      if (
        field.type ===
        "checkbox"
      ) {
        next =
          event.target.checked;
      }

      else if (
        field.type ===
        "number"
      ) {
        next =
          event.target.value ===
          ""
            ? ""
            : Number(
                event.target.value
              );
      }

      else {
        next =
          event.target.value;
      }

      onChange(
        next
      );
    }
  };

  // ===================================================
  // SELECT
  // ===================================================
  if (
    field.type ===
    "select"
  ) {
    return (
      <Form.Select
        {...common}
      >

        <option value="">
          Select...
        </option>

        {(field.options ||
          []).map(
          (
            option
          ) => {
            const optionValue =
              typeof option ===
              "object"
                ? option.value
                : option;

            const optionLabel =
              typeof option ===
              "object"
                ? option.label
                : option;

            return (
              <option
                key={
                  optionValue
                }
                value={
                  optionValue
                }
              >
                {
                  optionLabel
                }
              </option>
            );
          }
        )}

      </Form.Select>
    );
  }

  // ===================================================
  // TEXTAREA
  // ===================================================
  if (
    field.type ===
    "textarea"
  ) {
    return (
      <Form.Control
        as="textarea"
        rows={
          field.rows ||
          3
        }
        {...common}
      />
    );
  }

  // ===================================================
  // CHECKBOX
  // ===================================================
  if (
    field.type ===
    "checkbox"
  ) {
    return (
      <Form.Check
        type="switch"
        label={
          field.label
        }
        {...common}
      />
    );
  }

  // ===================================================
  // NORMAL FIELD
  // ===================================================
  return (
    <Form.Control
      type={
        field.type ||
        "text"
      }
      step={
        field.step
      }
      {...common}
    />
  );
}

// =====================================================
// TABLE CELL
// =====================================================
function TableCell({
  row,
  path
}) {
  // ===================================================
  // GST CERTIFICATE
  // ===================================================
  if (
    path ===
    "gstCertificate.originalName"
  ) {
    const file =
      row.gstCertificate;

    if (!file) {
      return "-";
    }

    return (
      <ViewFileLink
        file={
          file
        }
        showName={
          false
        }
      />
    );
  }

  // ===================================================
  // PAN CARD
  // ===================================================
  if (
    path ===
    "panCard.originalName"
  ) {
    const file =
      row.panCard;

    if (!file) {
      return "-";
    }

    return (
      <ViewFileLink
        file={
          file
        }
        showName={
          false
        }
      />
    );
  }

  // ===================================================
  // SUPPORTING FILES
  // ===================================================
  if (
    path ===
    "supportingFiles"
  ) {
    const files =
      row.supportingFiles;

    if (
      !Array.isArray(
        files
      ) ||
      files.length ===
        0
    ) {
      return "-";
    }

    return (
      <div className="d-flex flex-column gap-1">

        {files.map(
          (
            file,
            index
          ) => (
            <ViewFileLink
              key={
                file?.fileName ||
                file?.originalName ||
                index
              }
              file={
                file
              }
              showName={
                false
              }
            />
          )
        )}

      </div>
    );
  }

  // ===================================================
  // NORMAL COLUMN
  // ===================================================
  const value =
    getByPath(
      row,
      path
    );

  return String(
    value ??
      "-"
  );
}

// =====================================================
// BUILD VENDOR FORM DATA
// =====================================================
function buildVendorFormData(
  data
) {
  const formData =
    new FormData();

  const normalFields = [
    "vendorCode",
    "vendorName",
    "purchaseType",
    "currency",
    "gstNo",
    "panNo",
    "bankName",
    "accountNo",
    "ifsc",
    "bankAddress",
    "cancelledCheque",
    "isActive"
  ];

  normalFields.forEach(
    (
      field
    ) => {
      const value =
        data[
          field
        ];

      if (
        value !==
          undefined &&
        value !==
          null
      ) {
        formData.append(
          field,
          String(
            value
          )
        );
      }
    }
  );

  // ===================================================
  // ADDRESS
  // ===================================================
  formData.append(
    "registeredAddress",
    JSON.stringify(
      data.registeredAddress ||
        {}
    )
  );

  // ===================================================
  // CONTACTS
  // ===================================================
  formData.append(
    "contacts",
    JSON.stringify(
      data.contacts ||
        []
    )
  );

  // ===================================================
  // GST CERTIFICATE
  // ===================================================
  if (
    isFile(
      data.gstCertificate
    )
  ) {
    formData.append(
      "gstCertificate",
      data.gstCertificate
    );
  }

  // ===================================================
  // PAN CARD
  // ===================================================
  if (
    isFile(
      data.panCard
    )
  ) {
    formData.append(
      "panCard",
      data.panCard
    );
  }

  // ===================================================
  // SUPPORTING FILES
  // ===================================================
  if (
    Array.isArray(
      data.supportingFiles
    )
  ) {
    data.supportingFiles.forEach(
      (
        file
      ) => {
        if (
          isFile(
            file
          )
        ) {
          formData.append(
            "supportingFiles",
            file
          );
        }
      }
    );
  }

  return formData;
}

// =====================================================
// NORMALIZE TEXT
// =====================================================
function normalizeText(
  value
) {
  return String(
    value ||
    ""
  )
    .trim()
    .toLowerCase();
}

// =====================================================
// MASTER PAGE
// =====================================================
export default function MasterPage({
  config
}) {
  const qc =
    useQueryClient();

  const [
    page,
    setPage
  ] =
    useState(1);

  const [
    search,
    setSearch
  ] =
    useState("");

  const [
    activeFilter,
    setActiveFilter
  ] =
    useState("");

  const [
    show,
    setShow
  ] =
    useState(false);

  const [
    editing,
    setEditing
  ] =
    useState(null);

  const [
    form,
    setForm
  ] =
    useState(
      config.initial ||
        {}
    );

  // ===================================================
  // AUTO CODE CONFIGURATION
  //
  // Example:
  //
  // autoCode: {
  //   enabled: true,
  //   field: "vendorCode"
  // }
  // ===================================================
  const autoCodeConfig =
    config.autoCode ||
    null;

  const hasAutoCode =
    Boolean(
      autoCodeConfig?.enabled &&
      autoCodeConfig?.field
    );

  // ===================================================
  // AUTO CODE PREVIEW LOADING
  // ===================================================
  const [
    codeLoading,
    setCodeLoading
  ] =
    useState(false);

  // ===================================================
  // GST / ADDRESS CONFIGURATION
  // ===================================================
  const gstConfig =
    config.gstAutoFill ||
    null;

  const hasGSTAutoFill =
    Boolean(
      gstConfig?.enabled
    );

  const hasAddressAutoFill =
    Boolean(
      config.addressAutoFill
    );

  // ===================================================
  // GST LOADING
  // ===================================================
  const [
    gstLoading,
    setGstLoading
  ] =
    useState(false);

  // ===================================================
  // CITY OPTIONS
  // ===================================================
  const [
    cityLoading,
    setCityLoading
  ] =
    useState(false);

  const [
    cityOptions,
    setCityOptions
  ] =
    useState([]);

  // ===================================================
  // AREA / POST OFFICE OPTIONS
  // ===================================================
  const [
    areaLoading,
    setAreaLoading
  ] =
    useState(false);

  const [
    areaOptions,
    setAreaOptions
  ] =
    useState([]);

  const [
    selectedAreaIndex,
    setSelectedAreaIndex
  ] =
    useState("");

  // ===================================================
  // QUERY
  // ===================================================
  const query =
    useQuery({
      queryKey: [
        "master",
        config.endpoint,
        page,
        search,
        activeFilter
      ],

      queryFn: () =>
        masterApi.list(
          config.endpoint,
          {
            page,
            limit: 30,
            search,

            ...(
              activeFilter !==
              ""
                ? {
                    isActive:
                      activeFilter
                  }
                : {}
            )
          }
        )
    });

  // ===================================================
  // SAVE
  //
  // IMPORTANT:
  //
  // Actual code allocation happens in backend CREATE.
  //
  // Frontend preview is never final authority.
  // ===================================================
  const save =
    useMutation({
      mutationFn: (
        payload
      ) =>
        editing
          ? masterApi.update(
              config.endpoint,
              editing._id,
              payload
            )
          : masterApi.create(
              config.endpoint,
              payload
            ),

      onSuccess: (
        response
      ) => {
        const savedData =
          response?.data ||
          response;

        const actualCode =
          hasAutoCode
            ? getByPath(
                savedData,
                autoCodeConfig.field
              )
            : "";

        if (
          actualCode &&
          !editing
        ) {
          toast.success(
            `${config.singular} created successfully - ${actualCode}`
          );
        } else {
          toast.success(
            `${config.singular} ${
              editing
                ? "updated"
                : "created"
            }`
          );
        }

        setShow(
          false
        );

        setEditing(
          null
        );

        setForm(
          structuredClone(
            config.initial ||
              {}
          )
        );

        setCityOptions(
          []
        );

        setAreaOptions(
          []
        );

        setSelectedAreaIndex(
          ""
        );

        qc.invalidateQueries({
          queryKey: [
            "master",
            config.endpoint
          ]
        });
      },

      onError: (
        error
      ) =>
        toast.error(
          getApiError(
            error
          )
        )
    });

  // ===================================================
  // STATUS
  // ===================================================
  const statusMutation =
    useMutation({
      mutationFn: ({
        id,
        isActive
      }) =>
        masterApi.setStatus(
          config.endpoint,
          id,
          isActive
        ),

      onSuccess: () => {
        toast.success(
          "Status updated"
        );

        qc.invalidateQueries({
          queryKey: [
            "master",
            config.endpoint
          ]
        });
      },

      onError: (
        error
      ) =>
        toast.error(
          getApiError(
            error
          )
        )
    });

  // ===================================================
  // RESET SMART ADDRESS
  // ===================================================
  function resetAddressLookup() {
    setCityOptions(
      []
    );

    setAreaOptions(
      []
    );

    setSelectedAreaIndex(
      ""
    );
  }

  // ===================================================
  // LOAD NEXT MASTER CODE - PREVIEW ONLY
  //
  // IMPORTANT:
  //
  // THIS DOES NOT INCREMENT SEQUENCE.
  //
  // Example:
  //
  // DB value = 10
  //
  // Open Vendor
  // -> preview TT11
  // -> DB remains 10
  //
  // Cancel
  // -> DB remains 10
  //
  // Open again
  // -> TT11 again
  //
  // Actual increment only happens when CREATE API
  // is called after pressing Save.
  // ===================================================
  async function loadNextCodePreview() {
    if (
      !hasAutoCode
    ) {
      return "";
    }

    setCodeLoading(
      true
    );

    try {
      // =================================================
      // GET MASTER KEY FROM ENDPOINT
      //
      // /vendors
      // -> vendors
      //
      // /cost-centers
      // -> cost-centers
      // =================================================
      const master =
        String(
          config.endpoint ||
          ""
        )
          .replace(
            /^\/+/,
            ""
          )
          .trim();

      if (
        !master
      ) {
        throw new Error(
          "Master endpoint is missing"
        );
      }

      // =================================================
      // PREVIEW API
      //
      // Backend getNextCode() now only previews.
      //
      // NO MongoDB $inc here.
      // =================================================
      const response =
        await http.get(
          "/master-code/next",
          {
            params: {
              master
            }
          }
        );

      const previewCode =
        response.data?.data
          ?.code ||
        "";

      if (
        !previewCode
      ) {
        throw new Error(
          "Code preview could not be generated"
        );
      }

      // =================================================
      // SHOW PREVIEW CODE IN FORM
      // =================================================
      setForm(
        (
          previous
        ) =>
          setByPath(
            previous,
            autoCodeConfig.field,
            previewCode
          )
      );

      return previewCode;
    } catch (
      error
    ) {
      console.error(
        "[MASTER CODE PREVIEW]",
        error
      );

      toast.error(
        getApiError(
          error,
          "Unable to preview next code"
        )
      );

      return "";
    } finally {
      setCodeLoading(
        false
      );
    }
  }

  // ===================================================
  // NEW
  //
  // Opening form only previews code.
  //
  // NO increment.
  //
  // Cancel does nothing to sequence.
  // ===================================================
  async function openNew() {
    setEditing(
      null
    );

    // =================================================
    // RESET FORM
    // =================================================
    setForm(
      structuredClone(
        config.initial ||
          {}
      )
    );

    resetAddressLookup();

    setShow(
      true
    );

    // =================================================
    // PREVIEW CODE ONLY
    // =================================================
    if (
      hasAutoCode
    ) {
      await loadNextCodePreview();
    }
  }

  // ===================================================
  // EDIT
  //
  // Existing saved code remains unchanged.
  //
  // No preview.
  // No increment.
  // ===================================================
  function openEdit(
    row
  ) {
    setEditing(
      row
    );

    setForm(
      structuredClone(
        row
      )
    );

    resetAddressLookup();

    setShow(
      true
    );

    // =================================================
    // LOAD EXISTING STATE -> CITY OPTIONS
    // =================================================
    if (
      hasAddressAutoFill
    ) {
      const state =
        getByPath(
          row,
          "registeredAddress.state"
        );

      const city =
        getByPath(
          row,
          "registeredAddress.city"
        );

      if (
        state
      ) {
        loadCities(
          state
        );

        if (
          city
        ) {
          loadAreas(
            state,
            city,
            true
          );
        }
      }
    }
  }

  // ===================================================
  // SET FIELD
  // ===================================================
  function setField(
    path,
    value
  ) {
    setForm(
      (
        previous
      ) =>
        setByPath(
          previous,
          path,
          value
        )
    );
  }

  // ===================================================
  // LOAD CITIES
  //
  // State -> Cities
  // ===================================================
  async function loadCities(
    stateName
  ) {
    const state =
      String(
        stateName ||
        ""
      ).trim();

    if (
      !hasAddressAutoFill ||
      !state
    ) {
      setCityOptions(
        []
      );

      return [];
    }

    setCityLoading(
      true
    );

    try {
      const response =
        await http.get(
          "/companies/location/cities",
          {
            params: {
              state
            }
          }
        );

      const cities =
        response.data?.data
          ?.cities ||
        [];

      setCityOptions(
        cities
      );

      return cities;
    } catch (
      error
    ) {
      setCityOptions(
        []
      );

      toast.error(
        getApiError(
          error,
          "Unable to load cities"
        )
      );

      return [];
    } finally {
      setCityLoading(
        false
      );
    }
  }

  // ===================================================
  // LOAD AREAS / POST OFFICES
  //
  // State + City -> Areas
  // ===================================================
  async function loadAreas(
    stateName,
    cityName,
    silent = false
  ) {
    const state =
      String(
        stateName ||
        ""
      ).trim();

    const city =
      String(
        cityName ||
        ""
      ).trim();

    if (
      !hasAddressAutoFill ||
      !state ||
      !city
    ) {
      setAreaOptions(
        []
      );

      return [];
    }

    setAreaLoading(
      true
    );

    setAreaOptions(
      []
    );

    setSelectedAreaIndex(
      ""
    );

    try {
      const response =
        await http.get(
          "/companies/location/areas",
          {
            params: {
              state,
              city
            }
          }
        );

      const areas =
        response.data?.data
          ?.areas ||
        [];

      setAreaOptions(
        areas
      );

      return areas;
    } catch (
      error
    ) {
      setAreaOptions(
        []
      );

      if (
        !silent
      ) {
        toast.error(
          getApiError(
            error,
            "Unable to load Area / Post Office"
          )
        );
      }

      return [];
    } finally {
      setAreaLoading(
        false
      );
    }
  }

  // ===================================================
  // GST LOOKUP
  //
  // Company:
  // gstin -> pan
  //
  // Vendor:
  // gstNo -> panNo
  //
  // Delivery:
  // gstNo -> panNo
  // ===================================================
  async function lookupGST(
    value
  ) {
    if (
      !hasGSTAutoFill
    ) {
      return;
    }

    const gstin =
      String(
        value ||
        ""
      )
        .trim()
        .toUpperCase();

    if (
      gstin.length !==
      15
    ) {
      return;
    }

    setGstLoading(
      true
    );

    try {
      const response =
        await http.get(
          `/companies/gst/${encodeURIComponent(
            gstin
          )}`
        );

      const data =
        response.data?.data;

      if (
        !data
      ) {
        return;
      }

      const gstField =
        gstConfig.gstField;

      const panField =
        gstConfig.panField;

      const gstStateField =
        gstConfig.gstStateField;

      const gstStateCodeField =
        gstConfig.gstStateCodeField;

      const addressStateField =
        gstConfig.addressStateField ||
        "registeredAddress.state";

      const addressStateCodeField =
        gstConfig.addressStateCodeField ||
        "registeredAddress.stateCode";

      setForm(
        (
          previous
        ) => {
          let next =
            structuredClone(
              previous
            );

          // =============================================
          // GST NUMBER
          // =============================================
          if (
            gstField
          ) {
            next =
              setByPath(
                next,
                gstField,
                data.gstin ||
                  gstin
              );
          }

          // =============================================
          // PAN
          // =============================================
          if (
            panField
          ) {
            next =
              setByPath(
                next,
                panField,
                data.pan ||
                  ""
              );
          }

          // =============================================
          // TOP-LEVEL GST STATE
          // COMPANY
          // =============================================
          if (
            gstStateField
          ) {
            next =
              setByPath(
                next,
                gstStateField,
                data.gstState ||
                  ""
              );
          }

          // =============================================
          // TOP-LEVEL GST STATE CODE
          // COMPANY
          // =============================================
          if (
            gstStateCodeField
          ) {
            next =
              setByPath(
                next,
                gstStateCodeField,
                data.stateCode ||
                  ""
              );
          }

          // =============================================
          // CURRENT ADDRESS STATE
          // =============================================
          const currentAddressState =
            getByPath(
              next,
              addressStateField
            );

          const stateChanged =
            normalizeText(
              currentAddressState
            ) !==
            normalizeText(
              data.gstState
            );

          // =============================================
          // ADDRESS STATE
          // =============================================
          next =
            setByPath(
              next,
              addressStateField,
              data.gstState ||
                ""
            );

          // =============================================
          // ADDRESS STATE CODE
          // =============================================
          next =
            setByPath(
              next,
              addressStateCodeField,
              data.stateCode ||
                ""
            );

          // =============================================
          // CLEAR DEPENDENT VALUES IF STATE CHANGED
          // =============================================
          if (
            stateChanged
          ) {
            next =
              setByPath(
                next,
                "registeredAddress.city",
                ""
              );

            next =
              setByPath(
                next,
                "registeredAddress.district",
                ""
              );

            next =
              setByPath(
                next,
                "registeredAddress.pincode",
                ""
              );
          }

          // =============================================
          // COUNTRY
          // =============================================
          next =
            setByPath(
              next,
              "registeredAddress.country",
              "India"
            );

          return next;
        }
      );

      // =================================================
      // LOAD CITIES FROM GST STATE
      // =================================================
      if (
        hasAddressAutoFill &&
        data.gstState
      ) {
        setAreaOptions(
          []
        );

        setSelectedAreaIndex(
          ""
        );

        await loadCities(
          data.gstState
        );
      }

      toast.success(
        "GSTIN validated"
      );
    } catch (
      error
    ) {
      toast.error(
        getApiError(
          error,
          "Invalid GSTIN"
        )
      );
    } finally {
      setGstLoading(
        false
      );
    }
  }

  // ===================================================
  // STATE CHANGE
  // ===================================================
  async function changeAddressState(
    stateName
  ) {
    const selectedState =
      INDIA_STATE_OPTIONS.find(
        (
          item
        ) =>
          item.name ===
          stateName
      );

    setForm(
      (
        previous
      ) => {
        let next =
          structuredClone(
            previous
          );

        next =
          setByPath(
            next,
            "registeredAddress.state",
            stateName
          );

        next =
          setByPath(
            next,
            "registeredAddress.stateCode",
            selectedState?.code ||
              ""
          );

        // =============================================
        // CLEAR DEPENDENT LOCATION
        // =============================================
        next =
          setByPath(
            next,
            "registeredAddress.city",
            ""
          );

        next =
          setByPath(
            next,
            "registeredAddress.district",
            ""
          );

        next =
          setByPath(
            next,
            "registeredAddress.pincode",
            ""
          );

        next =
          setByPath(
            next,
            "registeredAddress.country",
            "India"
          );

        return next;
      }
    );

    setAreaOptions(
      []
    );

    setSelectedAreaIndex(
      ""
    );

    if (
      stateName
    ) {
      await loadCities(
        stateName
      );
    } else {
      setCityOptions(
        []
      );
    }
  }

  // ===================================================
  // CITY CHANGE
  // ===================================================
  async function changeCity(
    cityName
  ) {
    const state =
      getByPath(
        form,
        "registeredAddress.state"
      );

    setForm(
      (
        previous
      ) => {
        let next =
          structuredClone(
            previous
          );

        next =
          setByPath(
            next,
            "registeredAddress.city",
            cityName
          );

        next =
          setByPath(
            next,
            "registeredAddress.district",
            ""
          );

        next =
          setByPath(
            next,
            "registeredAddress.pincode",
            ""
          );

        return next;
      }
    );

    setAreaOptions(
      []
    );

    setSelectedAreaIndex(
      ""
    );

    if (
      state &&
      cityName
    ) {
      await loadAreas(
        state,
        cityName
      );
    }
  }

  // ===================================================
  // SELECT AREA / POST OFFICE
  // ===================================================
  function selectArea(
    indexValue
  ) {
    setSelectedAreaIndex(
      indexValue
    );

    if (
      indexValue ===
      ""
    ) {
      return;
    }

    const area =
      areaOptions[
        Number(
          indexValue
        )
      ];

    if (
      !area
    ) {
      return;
    }

    setForm(
      (
        previous
      ) => {
        let next =
          structuredClone(
            previous
          );

        // =================================================
        // DISTRICT
        // =================================================
        next =
          setByPath(
            next,
            "registeredAddress.district",
            area.district ||
              ""
          );

        // =================================================
        // PINCODE
        // =================================================
        next =
          setByPath(
            next,
            "registeredAddress.pincode",
            area.pincode ||
              ""
          );

        // =================================================
        // STATE
        // =================================================
        next =
          setByPath(
            next,
            "registeredAddress.state",
            area.state ||
              getByPath(
                next,
                "registeredAddress.state"
              ) ||
              ""
          );

        // =================================================
        // STATE CODE
        // =================================================
        next =
          setByPath(
            next,
            "registeredAddress.stateCode",
            area.stateCode ||
              getByPath(
                next,
                "registeredAddress.stateCode"
              ) ||
              ""
          );

        // =================================================
        // COUNTRY
        // =================================================
        next =
          setByPath(
            next,
            "registeredAddress.country",
            area.country ||
              "India"
          );

        return next;
      }
    );

    toast.success(
      "Address details filled"
    );
  }

  // ===================================================
  // SMART FIELD RENDER
  //
  // Supports:
  //
  // Auto Code Preview
  // GST Auto Fill
  // Smart Address
  // ===================================================
  function renderSmartField(
    field
  ) {
    const value =
      getByPath(
        form,
        field.name
      );

    const gstField =
      gstConfig?.gstField ||
      "";

    const panField =
      gstConfig?.panField ||
      "";

    const gstStateField =
      gstConfig?.gstStateField ||
      "";

    const gstStateCodeField =
      gstConfig?.gstStateCodeField ||
      "";

    // =================================================
    // AUTO-GENERATED MASTER CODE
    //
    // NEW:
    // Preview only.
    //
    // SAVE:
    // Backend allocates actual code.
    //
    // EDIT:
    // Existing code retained.
    // =================================================
    if (
      hasAutoCode &&
      field.name ===
        autoCodeConfig.field
    ) {
      return (
        <div className="position-relative">

          <Form.Control
            readOnly
            required={
              field.required
            }
            value={
              value ||
              ""
            }
            placeholder={
              codeLoading
                ? "Loading next code..."
                : "Auto generated"
            }
          />

          {codeLoading && (
            <Spinner
              animation="border"
              size="sm"
              style={{
                position:
                  "absolute",

                right:
                  12,

                top:
                  11
              }}
            />
          )}

          {!editing &&
            value &&
            !codeLoading && (
              <div className="small text-success mt-1">

                <i className="bi bi-check-circle me-1" />

                Next code - assigned on Save

              </div>
            )}

        </div>
      );
    }

    // =================================================
    // GST NUMBER
    // =================================================
    if (
      hasGSTAutoFill &&
      field.name ===
        gstField
    ) {
      return (
        <div className="position-relative">

          <Form.Control
            required={
              field.required
            }
            maxLength={
              15
            }
            value={
              value ||
              ""
            }
            placeholder="Enter 15 character GSTIN"
            onChange={(
              event
            ) => {
              const gstValue =
                String(
                  event.target.value ||
                    ""
                )
                  .toUpperCase()
                  .replace(
                    /\s/g,
                    ""
                  )
                  .slice(
                    0,
                    15
                  );

              setField(
                gstField,
                gstValue
              );

              if (
                gstValue.length ===
                15
              ) {
                lookupGST(
                  gstValue
                );
              }
            }}
          />

          {gstLoading && (
            <Spinner
              animation="border"
              size="sm"
              style={{
                position:
                  "absolute",

                right:
                  12,

                top:
                  11
              }}
            />
          )}

        </div>
      );
    }

    // =================================================
    // PAN
    // =================================================
    if (
      hasGSTAutoFill &&
      panField &&
      field.name ===
        panField
    ) {
      return (
        <Form.Control
          required={
            field.required
          }
          maxLength={
            10
          }
          value={
            value ||
            ""
          }
          onChange={(
            event
          ) =>
            setField(
              field.name,
              String(
                event.target.value ||
                  ""
              )
                .toUpperCase()
                .replace(
                  /\s/g,
                  ""
                )
                .slice(
                  0,
                  10
                )
            )
          }
        />
      );
    }

    // =================================================
    // TOP LEVEL GST STATE CODE
    // =================================================
    if (
      hasGSTAutoFill &&
      gstStateCodeField &&
      field.name ===
        gstStateCodeField
    ) {
      return (
        <Form.Control
          readOnly
          required={
            field.required
          }
          value={
            value ||
            ""
          }
          placeholder="Auto from GSTIN"
        />
      );
    }

    // =================================================
    // TOP LEVEL GST STATE
    // =================================================
    if (
      hasGSTAutoFill &&
      gstStateField &&
      field.name ===
        gstStateField
    ) {
      return (
        <Form.Control
          readOnly
          required={
            field.required
          }
          value={
            value ||
            ""
          }
          placeholder="Auto from GSTIN"
        />
      );
    }

    // =================================================
    // ADDRESS STATE
    // =================================================
    if (
      hasAddressAutoFill &&
      field.name ===
        "registeredAddress.state"
    ) {
      return (
        <Form.Select
          required={
            field.required
          }
          value={
            value ||
            ""
          }
          onChange={(
            event
          ) =>
            changeAddressState(
              event.target.value
            )
          }
        >

          <option value="">
            Select State
          </option>

          {INDIA_STATE_OPTIONS.map(
            (
              state
            ) => (
              <option
                key={
                  state.code
                }
                value={
                  state.name
                }
              >
                {
                  state.name
                }
              </option>
            )
          )}

        </Form.Select>
      );
    }

    // =================================================
    // ADDRESS STATE CODE
    // =================================================
    if (
      hasAddressAutoFill &&
      field.name ===
        "registeredAddress.stateCode"
    ) {
      return (
        <Form.Control
          readOnly
          value={
            value ||
            ""
          }
          placeholder="Auto from State"
        />
      );
    }

    // =================================================
    // CITY
    //
    // State
    // -> City
    // -> Area / Post Office
    // =================================================
    if (
      hasAddressAutoFill &&
      field.name ===
        "registeredAddress.city"
    ) {
      const selectedState =
        getByPath(
          form,
          "registeredAddress.state"
        );

      const selectedCity =
        value ||
        "";

      return (
        <>
          <div className="position-relative">

            <Form.Select
              required={
                field.required
              }
              disabled={
                !selectedState ||
                cityLoading
              }
              value={
                selectedCity
              }
              onChange={(
                event
              ) =>
                changeCity(
                  event.target.value
                )
              }
            >

              <option value="">
                {cityLoading
                  ? "Loading cities..."
                  : !selectedState
                  ? "Select State first"
                  : "Select City"}
              </option>

              {cityOptions.map(
                (
                  city,
                  index
                ) => {
                  const cityName =
                    typeof city ===
                    "string"
                      ? city
                      : city.name;

                  return (
                    <option
                      key={`${cityName}-${index}`}
                      value={
                        cityName
                      }
                    >
                      {
                        cityName
                      }
                    </option>
                  );
                }
              )}

            </Form.Select>

            {cityLoading && (
              <Spinner
                animation="border"
                size="sm"
                style={{
                  position:
                    "absolute",

                  right:
                    32,

                  top:
                    11
                }}
              />
            )}

          </div>

          {/* =============================================
              AREA / POST OFFICE
          ============================================= */}
          {selectedCity && (
            <div className="mt-2">

              <Form.Label className="small fw-semibold mb-1">
                Area / Post Office
              </Form.Label>

              <div className="position-relative">

                <Form.Select
                  disabled={
                    areaLoading
                  }
                  value={
                    selectedAreaIndex
                  }
                  onChange={(
                    event
                  ) =>
                    selectArea(
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    {areaLoading
                      ? "Loading areas..."
                      : areaOptions.length
                      ? "Select Area / Post Office"
                      : "No Area / Post Office available"}
                  </option>

                  {areaOptions.map(
                    (
                      area,
                      index
                    ) => (
                      <option
                        key={`${area.areaName}-${area.pincode}-${index}`}
                        value={
                          index
                        }
                      >

                        {
                          area.areaName
                        }

                        {area.branchType
                          ? ` - ${area.branchType}`
                          : ""}

                        {area.pincode
                          ? ` - ${area.pincode}`
                          : ""}

                      </option>
                    )
                  )}

                </Form.Select>

                {areaLoading && (
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{
                      position:
                        "absolute",

                      right:
                        32,

                      top:
                        11
                    }}
                  />
                )}

              </div>

            </div>
          )}
        </>
      );
    }

    // =================================================
    // DISTRICT
    // =================================================
    if (
      hasAddressAutoFill &&
      field.name ===
        "registeredAddress.district"
    ) {
      return (
        <Form.Control
          readOnly
          required={
            field.required
          }
          value={
            value ||
            ""
          }
          placeholder="Auto from Area / Post Office"
        />
      );
    }

    // =================================================
    // PINCODE
    // =================================================
    if (
      hasAddressAutoFill &&
      field.name ===
        "registeredAddress.pincode"
    ) {
      return (
        <Form.Control
          readOnly
          required={
            field.required
          }
          value={
            value ||
            ""
          }
          placeholder="Auto from Area / Post Office"
        />
      );
    }

    // =================================================
    // COUNTRY
    // =================================================
    if (
      hasAddressAutoFill &&
      field.name ===
        "registeredAddress.country"
    ) {
      return (
        <Form.Control
          readOnly
          value={
            value ||
            "India"
          }
        />
      );
    }

    // =================================================
    // NORMAL FIELD
    // =================================================
    return (
      <Field
        field={
          field
        }
        value={
          value
        }
        onChange={(
          nextValue
        ) =>
          setField(
            field.name,
            nextValue
          )
        }
      />
    );
  }

  // ===================================================
  // SUBMIT
  // ===================================================
  function submit(
    event
  ) {
    event.preventDefault();

    // =================================================
    // PREVIEW CODE MUST BE AVAILABLE
    //
    // IMPORTANT:
    //
    // This does NOT mean this is the final code.
    //
    // Backend create controller allocates final code.
    // =================================================
    if (
      hasAutoCode &&
      !editing
    ) {
      const previewCode =
        getByPath(
          form,
          autoCodeConfig.field
        );

      if (
        !previewCode
      ) {
        toast.error(
          "Unable to preview master code. Please close and open the form again."
        );

        return;
      }
    }

    // =================================================
    // VENDOR
    //
    // Existing GridFS multipart logic remains same.
    // =================================================
    if (
      config.endpoint ===
      "/vendors"
    ) {
      let vendorData = {
        ...form
      };

      delete vendorData._id;
      delete vendorData.__v;
      delete vendorData.createdAt;
      delete vendorData.updatedAt;

      vendorData =
        config.clean
          ? config.clean(
              vendorData
            )
          : vendorData;

      const formData =
        buildVendorFormData(
          vendorData
        );

      // =================================================
      // ACTUAL VENDOR CODE ALLOCATION HAPPENS
      // IN BACKEND vendorController.create()
      // =================================================
      save.mutate(
        formData
      );

      return;
    }

    // =================================================
    // OTHER MASTERS
    // =================================================
    let payload =
      structuredClone(
        form
      );

    delete payload._id;
    delete payload.__v;
    delete payload.createdAt;
    delete payload.updatedAt;

    payload =
      config.clean
        ? config.clean(
            payload
          )
        : payload;

    // =================================================
    // ACTUAL CODE ALLOCATION HAPPENS IN BACKEND:
    //
    // Company -> companyController.create()
    //
    // Other generic masters ->
    // masterControllerFactory.create()
    // =================================================
    save.mutate(
      payload
    );
  }

  // ===================================================
  // DATA
  // ===================================================
  const rows =
    query.data?.data ||
    [];

  const pagination =
    query.data
      ?.pagination || {
      page:
        1,

      pages:
        1,

      total:
        rows.length
    };

  // ===================================================
  // UI
  // ===================================================
  return (
    <>
      <PageHeader
        title={
          config.title
        }

        subtitle={`Maintain ${config.singular.toLowerCase()} records used while creating purchase orders.`}

        actions={
          <PermissionGate
            any={[
              config.writePermission
            ]}
          >

            <Button
              onClick={
                openNew
              }
            >

              <i className="bi bi-plus-lg me-1" />

              Add{" "}
              {
                config.singular
              }

            </Button>

          </PermissionGate>
        }
      />

      <Card className="border-0 shadow-sm">

        <Card.Body className="p-3 p-md-4">

          <Row className="g-2 mb-3">

            <Col
              md={
                7
              }
              lg={
                5
              }
            >

              <Form.Control
                placeholder={
                  config.searchPlaceholder
                }

                value={
                  search
                }

                onChange={(
                  event
                ) => {
                  setSearch(
                    event.target.value
                  );

                  setPage(
                    1
                  );
                }}
              />

            </Col>

            <Col
              md={
                3
              }
              lg={
                2
              }
            >

              <Form.Select
                value={
                  activeFilter
                }

                onChange={(
                  event
                ) => {
                  setActiveFilter(
                    event.target.value
                  );

                  setPage(
                    1
                  );
                }}
              >

                <option value="">
                  All status
                </option>

                <option value="true">
                  Active
                </option>

                <option value="false">
                  Inactive
                </option>

              </Form.Select>

            </Col>

          </Row>

          {query.isLoading ? (

            <LoadingBlock />

          ) : rows.length ===
            0 ? (

            <EmptyState />

          ) : (

            <>
              <div className="table-responsive">

                <Table
                  hover
                  className="align-middle"
                >

                  <thead className="table-light">

                    <tr>

                      {config.columns.map(
                        ([
                          ,
                          label
                        ]) => (
                          <th
                            key={
                              label
                            }
                          >
                            {
                              label
                            }
                          </th>
                        )
                      )}

                      <th>
                        Status
                      </th>

                      <th className="text-end">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {rows.map(
                      (
                        row
                      ) => (

                        <tr
                          key={
                            row._id
                          }
                        >

                          {config.columns.map(
                            ([
                              path
                            ]) => (
                              <td
                                key={
                                  path
                                }
                              >

                                <TableCell
                                  row={
                                    row
                                  }
                                  path={
                                    path
                                  }
                                />

                              </td>
                            )
                          )}

                          <td>

                            <span
                              className={`badge ${
                                row.isActive
                                  ? "text-bg-success"
                                  : "text-bg-secondary"
                              }`}
                            >

                              {row.isActive
                                ? "Active"
                                : "Inactive"}

                            </span>

                          </td>

                          <td className="text-end text-nowrap">

                            <PermissionGate
                              any={[
                                config.writePermission
                              ]}
                            >

                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() =>
                                  openEdit(
                                    row
                                  )
                                }
                              >

                                <i className="bi bi-pencil" />

                              </Button>

                              <Button
                                variant={
                                  row.isActive
                                    ? "outline-danger"
                                    : "outline-success"
                                }
                                size="sm"
                                onClick={() =>
                                  statusMutation.mutate(
                                    {
                                      id:
                                        row._id,

                                      isActive:
                                        !row.isActive
                                    }
                                  )
                                }
                              >

                                <i
                                  className={`bi ${
                                    row.isActive
                                      ? "bi-pause-circle"
                                      : "bi-play-circle"
                                  }`}
                                />

                              </Button>

                            </PermissionGate>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </Table>

              </div>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                <span className="small text-secondary">

                  {
                    pagination.total
                  }{" "}
                  record(s)

                </span>

                <PaginationBar
                  page={
                    pagination.page
                  }

                  pages={
                    pagination.pages
                  }

                  onChange={
                    setPage
                  }
                />

              </div>
            </>

          )}

        </Card.Body>

      </Card>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      <Modal
        show={
          show
        }

        onHide={() =>
          !save.isPending &&
          !codeLoading &&
          setShow(
            false
          )
        }

        size="lg"
        centered
        scrollable
      >

        <Form
          onSubmit={
            submit
          }
        >

          <Modal.Header
            closeButton={
              !codeLoading
            }
          >

            <Modal.Title>

              {editing
                ? `Edit ${config.singular}`
                : `Add ${config.singular}`}

            </Modal.Title>

          </Modal.Header>

          <Modal.Body
            style={{
              maxHeight:
                "70vh",

              overflowY:
                "auto"
            }}
          >

            <Row className="g-3">

              {config.fields.map(
                (
                  field
                ) => {
                  const isCheckbox =
                    field.type ===
                    "checkbox";

                  return (
                    <Col
                      key={
                        field.name
                      }

                      md={
                        field.col ||
                        6
                      }

                      className={
                        isCheckbox
                          ? "d-flex align-items-end"
                          : ""
                      }
                    >

                      {!isCheckbox && (

                        <Form.Label>

                          {
                            field.label
                          }

                          {field.required && (

                            <span className="text-danger">
                              {" "}
                              *
                            </span>

                          )}

                        </Form.Label>

                      )}

                      {(
                        hasAutoCode ||
                        hasGSTAutoFill ||
                        hasAddressAutoFill
                      ) ? (

                        renderSmartField(
                          field
                        )

                      ) : (

                        <Field
                          field={
                            field
                          }

                          value={
                            getByPath(
                              form,
                              field.name
                            )
                          }

                          onChange={(
                            value
                          ) =>
                            setForm(
                              (
                                previous
                              ) =>
                                setByPath(
                                  previous,
                                  field.name,
                                  value
                                )
                            )
                          }
                        />

                      )}

                    </Col>
                  );
                }
              )}

            </Row>

          </Modal.Body>

          <Modal.Footer>

            <Button
              type="button"
              variant="outline-secondary"

              disabled={
                save.isPending ||
                codeLoading
              }

              onClick={() =>
                setShow(
                  false
                )
              }
            >

              Cancel

            </Button>

            <Button
              type="submit"

              disabled={
                save.isPending ||
                codeLoading ||
                gstLoading ||
                cityLoading ||
                areaLoading
              }
            >

              {codeLoading
                ? "Loading Code..."
                : save.isPending
                ? "Saving..."
                : "Save"}

            </Button>

          </Modal.Footer>

        </Form>

      </Modal>
    </>
  );
}