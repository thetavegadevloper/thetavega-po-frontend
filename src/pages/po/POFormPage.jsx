import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Row,
  Table
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import LoadingBlock from "../../components/common/LoadingBlock";

import { masterApi } from "../../api/masterApi";
import { poApi } from "../../api/poApi";

import {
  PO_TYPES
} from "../../constants";

import {
  formatMoney,
  yyyyMmDd
} from "../../utils/format";

import { getApiError } from "../../utils/error";
import { useAuth } from "../../context/AuthContext";

// =====================================================
// TAXES & DUTIES OPTIONS
// =====================================================
const TAXES_DUTIES_OPTIONS = [
  "EXTRA AT ACTUAL",
  "INCLUSIVE",
  "NOT APPLICABLE"
];

// =====================================================
// EMPTY ITEM
// =====================================================
const emptyItem = () => ({
  materialId: "",
  materialCode: "",
  description: "",
  hsnSac: "",
  uom: "",

  qty: 1,
  rate: 0,

  gstPercent: 0,
  tdsPercent: 0,

  deliveryDate: "",
  remarks: "",

  manual: false
});

// =====================================================
// PAYMENT SPECIFIC TERM IDENTIFICATION
// =====================================================
function isPaymentSpecificTerm(term) {
  const title = String(
    term?.title || ""
  )
    .trim()
    .toLowerCase();

  const category = String(
    term?.category || ""
  )
    .trim()
    .toLowerCase();

  return (
    title === "payment terms" ||
    title === "payment term" ||
    category === "payment" ||
    category === "payment terms"
  );
}

// =====================================================
// INITIAL FORM
// =====================================================
const initial = {
  poDate: yyyyMmDd(),

  companyId: "",
  vendorId: "",
  deliveryAddressId: "",
  costCenterId: "",
  projectId: "",

  paymentTermId: "",

  purchaseType: "Domestic",
  currency: "INR",

  poType: "Project",

  documentHeading: "DOMESTIC PURCHASE ORDER",

  header: {
    quoteRefDocumentNo: "",
    documentType: "Email Quote",
    confirmedBy: "",
    projectDocumentNo: "",
    referenceNo: "",

    paymentSummary: "",

    buyerName: "Tejas Bakliwal",
    buyerContact: "9999999999",

    taxesDutiesText:
      "EXTRA AT ACTUAL",

    supplierTaxNote:
      "Supplier to ensure the Appropriate HSN & applicable Tax Rates as per applicable law.",

    specialNotes: "",
    authorizedSignatory: ""
  },

  items: [
    emptyItem()
  ],

  roundingOff: 0,

  specificTerms: []
};

// =====================================================
// MASTER QUERY
// =====================================================
function useMaster(
  endpoint,
  key,
  params = {}
) {
  return useQuery({
    queryKey: [
      "select",
      key,
      params
    ],

    queryFn: () =>
      masterApi.list(
        endpoint,
        {
          isActive: true,
          limit: 200,
          ...params
        }
      )
  });
}

// =====================================================
// COMPONENT
// =====================================================
export default function POFormPage() {
  const { id } = useParams();

  const editing = Boolean(id);

  const navigate = useNavigate();

  const {
    can
  } = useAuth();

  const [form, setForm] =
    useState(() =>
      structuredClone(initial)
    );

  const [
    initialized,
    setInitialized
  ] = useState(false);

  // ===================================================
  // MASTER DATA
  // ===================================================

  const companies =
    useMaster(
      "/companies",
      "companies"
    );

  const vendors =
    useMaster(
      "/vendors",
      "vendors"
    );

  const deliveries =
    useMaster(
      "/delivery-addresses",
      "deliveries"
    );

  const costCenters =
    useMaster(
      "/cost-centers",
      "cost-centers"
    );

  const projects =
    useMaster(
      "/projects",
      "projects"
    );

  const materials =
    useMaster(
      "/materials",
      "materials"
    );

  // ===================================================
  // PAYMENT TERMS MASTER
  // ===================================================

  const paymentTerms =
    useMaster(
      "/payment-terms",
      "payment-terms"
    );

  // ===================================================
  // SPECIFIC PO TERMS MASTER
  // ===================================================

  const terms =
    useMaster(
      "/po-terms",
      "specific-terms",
      {
        scope: "Specific"
      }
    );

  // ===================================================
  // EXISTING PO
  // ===================================================

  const existing =
    useQuery({
      queryKey: [
        "purchase-order",
        id
      ],

      queryFn: () =>
        poApi.get(id),

      enabled: editing
    });

  // ===================================================
  // AUTO SELECT SINGLE COMPANY
  // ===================================================

  useEffect(() => {
    if (
      !editing &&
      !form.companyId &&
      companies.data?.data?.length
    ) {
      const company =
        companies.data.data[0];

      setForm(
        (current) => {
          if (current.companyId) {
            return current;
          }

          return {
            ...current,

            companyId:
              company._id
          };
        }
      );
    }
  }, [
    editing,
    companies.data,
    form.companyId
  ]);

  // ===================================================
  // COMPANY DISPLAY
  // ===================================================

  const selectedCompany =
    useMemo(() => {
      const companyList =
        companies.data?.data ||
        [];

      const matchedCompany =
        companyList.find(
          (company) =>
            String(
              company._id
            ) ===
            String(
              form.companyId
            )
        );

      if (matchedCompany) {
        return matchedCompany;
      }

      if (
        editing &&
        existing.data?.data?.company
      ) {
        const existingCompany =
          existing.data.data.company;

        return {
          _id:
            existingCompany.companyId,

          companyCode:
            existingCompany.companyCode,

          companyName:
            existingCompany.companyName
        };
      }

      return (
        companyList[0] ||
        null
      );
    }, [
      companies.data,
      form.companyId,
      editing,
      existing.data
    ]);

  // ===================================================
  // EDIT INITIALIZATION
  // ===================================================

  useEffect(() => {
    if (
      editing &&
      existing.data?.data &&
      !initialized
    ) {
      const po =
        existing.data.data;

      setForm({
        poDate:
          yyyyMmDd(
            po.poDate
          ),

        companyId:
          po.company?.companyId ||
          "",

        vendorId:
          po.vendor?.vendorId ||
          "",

        deliveryAddressId:
          po.delivery
            ?.deliveryAddressId ||
          "",

        costCenterId:
          po.costCenter
            ?.costCenterId ||
          "",

        projectId:
          po.project
            ?.projectId ||
          "",

        paymentTermId:
          po.paymentTerm
            ?.paymentTermId ||
          "",

        purchaseType:
          po.purchaseType ||
          "Domestic",

        poType:
          po.poType ||
          "Project",

        currency:
          po.currency ||
          "INR",

        documentHeading:
          po.documentHeading ||
          `${String(
            po.purchaseType ||
            "Domestic"
          ).toUpperCase()} PURCHASE ORDER`,

        header: {
          ...initial.header,
          ...po.header
        },

        items:
          (
            po.items || []
          ).map(
            (item) => ({
              ...item,

              materialId:
                item.materialId ||
                "",

              deliveryDate:
                item.deliveryDate
                  ? yyyyMmDd(
                      item.deliveryDate
                    )
                  : "",

              manual:
                !item.materialId
            })
          ),

        roundingOff:
          Number(
            po.totals
              ?.roundingOff ||
            0
          ),

        specificTerms:
          po.specificTerms ||
          []
      });

      setInitialized(true);
    }
  }, [
    editing,
    existing.data,
    initialized
  ]);

  // ===================================================
  // LOAD DEFAULT SPECIFIC TERMS
  // ===================================================

  useEffect(() => {
    if (
      !editing &&
      terms.data?.data?.length &&
      !form.specificTerms.length
    ) {
      setForm(
        (current) => {
          const paymentSummary =
            current.header
              .paymentSummary ||
            "";

          return {
            ...current,

            specificTerms:
              terms.data.data.map(
                (term) => ({
                  termId:
                    term._id,

                  termCode:
                    term.termCode,

                  category:
                    term.category,

                  title:
                    term.title,

                  text:
                    isPaymentSpecificTerm(
                      term
                    ) &&
                    paymentSummary
                      ? paymentSummary
                      : term.text,

                  displayOrder:
                    term.displayOrder,

                  mandatory:
                    term.mandatory,

                  canOverride:
                    term.canOverride,

                  highlights:
                    term.highlights ||
                    []
                })
              )
          };
        }
      );
    }
  }, [
    editing,
    terms.data,
    form.specificTerms.length
  ]);

  // ===================================================
  // SAVE
  // ===================================================

  const save =
    useMutation({
      mutationFn: (
        requestPayload
      ) =>
        editing
          ? poApi.update(
              id,
              requestPayload
            )
          : poApi.create(
              requestPayload
            ),

      onSuccess: (
        response
      ) => {
        toast.success(
          editing
            ? "PO updated successfully"
            : "PO draft created"
        );

        navigate(
          `/purchase-orders/${response.data._id}`
        );
      },

      onError: (
        error
      ) => {
        toast.error(
          getApiError(
            error
          )
        );
      }
    });

  // ===================================================
  // MATERIAL MAP
  // ===================================================

  const materialMap =
    useMemo(
      () =>
        new Map(
          (
            materials.data
              ?.data ||
            []
          ).map(
            (material) => [
              String(
                material._id
              ),
              material
            ]
          )
        ),
      [
        materials.data
      ]
    );

  // ===================================================
  // SELECT MATERIAL
  // ===================================================

  function selectMaterial(
    index,
    materialId
  ) {
    const material =
      materialMap.get(
        String(
          materialId
        )
      );

    setForm(
      (current) => {
        const items = [
          ...current.items
        ];

        items[index] =
          material
            ? {
                ...items[index],

                materialId:
                  material._id,

                materialCode:
                  material.itemCode,

                description:
                  material.description,

                hsnSac:
                  material.hsnSacCode,

                uom:
                  material.uom,

                gstPercent:
                  Number(
                    material.gstPercent ||
                    0
                  ),

                tdsPercent:
                  Number(
                    material.tdsPercent ||
                    0
                  ),

                rate:
                  Number(
                    material.rate ||
                    0
                  ),

                manual:
                  false
              }
            : {
                ...emptyItem()
              };

        return {
          ...current,
          items
        };
      }
    );
  }

  // ===================================================
  // PATCH ITEM
  // ===================================================

  function patchItem(
    index,
    patch
  ) {
    setForm(
      (current) => {
        const items = [
          ...current.items
        ];

        items[index] = {
          ...items[index],
          ...patch
        };

        return {
          ...current,
          items
        };
      }
    );
  }

  // ===================================================
  // REMOVE ITEM
  // ===================================================

  function removeItem(
    index
  ) {
    setForm(
      (current) => ({
        ...current,

        items:
          current.items.length === 1
            ? [
                emptyItem()
              ]
            : current.items.filter(
                (
                  _,
                  itemIndex
                ) =>
                  itemIndex !==
                  index
              )
      })
    );
  }

  // ===================================================
  // ADD ITEM
  // ===================================================

  function addItem() {
    setForm(
      (current) => ({
        ...current,

        items: [
          ...current.items,
          emptyItem()
        ]
      })
    );
  }

  // ===================================================
  // UPDATE SPECIFIC TERM
  // ===================================================

  function updateSpecificTerm(
    index,
    value
  ) {
    setForm(
      (current) => {
        const updatedTerms = [
          ...current.specificTerms
        ];

        updatedTerms[index] = {
          ...updatedTerms[index],

          text:
            value
        };

        return {
          ...current,

          specificTerms:
            updatedTerms
        };
      }
    );
  }

  // ===================================================
  // FRONTEND CALCULATION
  // ===================================================

  const calc =
    useMemo(() => {
      const rows =
        form.items.map(
          (item) => {
            const basic =
              Number(
                item.qty ||
                0
              ) *
              Number(
                item.rate ||
                0
              );

            const tax =
              basic *
              Number(
                item.gstPercent ||
                0
              ) /
              100;

            return {
              ...item,
              basic,
              tax
            };
          }
        );

      const sub =
        rows.reduce(
          (
            total,
            item
          ) =>
            total +
            item.basic,
          0
        );

      const tax =
        rows.reduce(
          (
            total,
            item
          ) =>
            total +
            item.tax,
          0
        );

      const rounding =
        Number(
          form.roundingOff ||
          0
        );

      const total =
        sub +
        tax +
        rounding;

      return {
        rows,
        sub,
        tax,
        rounding,
        total
      };
    }, [
      form.items,
      form.roundingOff
    ]);

  // ===================================================
  // API PAYLOAD
  // ===================================================

  function payload() {
    return {
      poDate:
        form.poDate,

      companyId:
        form.companyId,

      vendorId:
        form.vendorId,

      deliveryAddressId:
        form.deliveryAddressId,

      costCenterId:
        form.costCenterId,

      projectId:
        form.projectId ||
        undefined,

      paymentTermId:
        form.paymentTermId,

      purchaseType:
        form.purchaseType,

      poType:
        form.poType,

      currency:
        form.currency,

      documentHeading:
        form.documentHeading,

      header:
        form.header,

      items:
        form.items.map(
          (
            item,
            index
          ) =>
            item.manual
              ? {
                  srNo:
                    (
                      index +
                      1
                    ) *
                    10,

                  materialCode:
                    item.materialCode,

                  description:
                    item.description,

                  hsnSac:
                    item.hsnSac,

                  uom:
                    item.uom,

                  qty:
                    Number(
                      item.qty
                    ),

                  rate:
                    Number(
                      item.rate
                    ),

                  gstPercent:
                    Number(
                      item.gstPercent ||
                      0
                    ),

                  tdsPercent:
                    Number(
                      item.tdsPercent ||
                      0
                    ),

                  deliveryDate:
                    item.deliveryDate ||
                    null,

                  remarks:
                    item.remarks
                }
              : {
                  srNo:
                    (
                      index +
                      1
                    ) *
                    10,

                  materialId:
                    item.materialId,

                  qty:
                    Number(
                      item.qty
                    ),

                  rate:
                    Number(
                      item.rate
                    ),

                  deliveryDate:
                    item.deliveryDate ||
                    null,

                  remarks:
                    item.remarks
                }
        ),

      charges: {
        packingMode:
          "At Actual",

        packingValue:
          0,

        freightMode:
          "At Actual",

        freightValue:
          0
      },

      roundingOff:
        Number(
          form.roundingOff ||
          0
        ),

      specificTerms:
        form.specificTerms
    };
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  function submit(
    event
  ) {
    event.preventDefault();

    if (
      !form.companyId
    ) {
      return toast.error(
        "Company Master is not configured"
      );
    }

    if (
      !form.paymentTermId
    ) {
      return toast.error(
        "Payment Term is required"
      );
    }

    if (
      form.poType ===
        "Project" &&
      !form.projectId
    ) {
      return toast.error(
        "Project is required for Project PO"
      );
    }

    const invalidItem =
      form.items.some(
        (item) =>
          item.manual
            ? !item.materialCode ||
              !item.description ||
              !item.uom
            : !item.materialId
      );

    if (
      invalidItem
    ) {
      return toast.error(
        "Select a material for every item"
      );
    }

    save.mutate(
      payload()
    );
  }

  // ===================================================
  // LOADING
  // ===================================================

  if (
    editing &&
    existing.isLoading
  ) {
    return (
      <LoadingBlock text="Loading purchase order..." />
    );
  }

  // ===================================================
  // EDIT STATUS
  // ===================================================

  const currentPOStatus =
    existing.data
      ?.data
      ?.status ||
    "";

  const lockedStatuses = [
    "Cancelled",
    "Closed"
  ];

  if (
    editing &&
    currentPOStatus &&
    lockedStatuses.includes(
      currentPOStatus
    )
  ) {
    return (
      <Alert variant="warning">

        This Purchase Order
        cannot be edited.
        Current status:{" "}

        <strong>
          {currentPOStatus}
        </strong>

      </Alert>
    );
  }

  // ===================================================
  // UI
  // ===================================================

  return (
    <Form
      onSubmit={
        submit
      }
    >

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <PageHeader
        title={
          editing
            ? "Edit Purchase Order"
            : "Create Purchase Order"
        }

        subtitle={
          editing
            ? `Current Status: ${
                currentPOStatus ||
                "-"
              }`
            : "The backend recalculates all amounts and stores master snapshots when the PO is saved."
        }

        actions={
          <>

            <Button
              type="button"

              variant="outline-secondary"

              onClick={() =>
                navigate(
                  -1
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"

              disabled={
                save.isPending
              }
            >

              {save.isPending
                ? "Saving..."
                : editing
                ? "Update PO"
                : "Save Draft"}

            </Button>

          </>
        }
      />

      {/* =================================================
          1. PO HEADER & MASTER SELECTION
      ================================================= */}

      <Card className="border-0 shadow-sm mb-3">

        <Card.Header className="bg-white fw-bold py-3">

          1. PO Header & Master Selection

        </Card.Header>

        <Card.Body>

          <Row className="g-3">

            <Col md={3}>

              <Form.Label>
                PO Date *
              </Form.Label>

              <Form.Control
                type="date"

                required

                value={
                  form.poDate
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    poDate:
                      event
                        .target
                        .value
                  })
                }
              />

            </Col>

            <Col md={3}>

              <Form.Label>
                Company
              </Form.Label>

              <Form.Control
                readOnly

                value={
                  selectedCompany
                    ? `${
                        selectedCompany
                          .companyCode ||
                        ""
                      }${
                        selectedCompany
                          .companyCode &&
                        selectedCompany
                          .companyName
                          ? " - "
                          : ""
                      }${
                        selectedCompany
                          .companyName ||
                        ""
                      }`
                    : companies.isLoading
                    ? "Loading company..."
                    : "Company not configured"
                }
              />

            </Col>

            <Col md={3}>

              <Form.Label>
                Vendor *
              </Form.Label>

              <Form.Select
                required

                value={
                  form.vendorId
                }

                onChange={(
                  event
                ) => {

                  const vendorId =
                    event
                      .target
                      .value;

                  const vendor =
                    (
                      vendors
                        .data
                        ?.data ||
                      []
                    ).find(
                      (
                        item
                      ) =>
                        String(
                          item._id
                        ) ===
                        String(
                          vendorId
                        )
                    );

                  const purchaseType =
                    vendor
                      ?.purchaseType ||
                    "Domestic";

                  const currency =
                    vendor
                      ?.currency ||
                    "INR";

                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      vendorId,

                      purchaseType,

                      currency,

                      documentHeading:
                        `${purchaseType.toUpperCase()} PURCHASE ORDER`
                    })
                  );
                }}
              >

                <option value="">
                  Select
                </option>

                {(
                  vendors
                    .data
                    ?.data ||
                  []
                ).map(
                  (
                    vendor
                  ) => (

                    <option
                      key={
                        vendor._id
                      }

                      value={
                        vendor._id
                      }
                    >

                      {
                        vendor.vendorCode
                      }{" "}
                      -{" "}
                      {
                        vendor.vendorName
                      }

                    </option>

                  )
                )}

              </Form.Select>

            </Col>

            <Col md={3}>

              <Form.Label>
                Delivery Address *
              </Form.Label>

              <Form.Select
                required

                value={
                  form.deliveryAddressId
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    deliveryAddressId:
                      event
                        .target
                        .value
                  })
                }
              >

                <option value="">
                  Select
                </option>

                {(
                  deliveries
                    .data
                    ?.data ||
                  []
                ).map(
                  (
                    delivery
                  ) => (

                    <option
                      key={
                        delivery._id
                      }

                      value={
                        delivery._id
                      }
                    >

                      {
                        delivery.deliveryCode
                      }{" "}
                      -{" "}
                      {
                        delivery.name
                      }

                    </option>

                  )
                )}

              </Form.Select>

            </Col>

            <Col md={3}>

              <Form.Label>
                Cost Center *
              </Form.Label>

              <Form.Select
                required

                value={
                  form.costCenterId
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    costCenterId:
                      event
                        .target
                        .value
                  })
                }
              >

                <option value="">
                  Select
                </option>

                {(
                  costCenters
                    .data
                    ?.data ||
                  []
                ).map(
                  (
                    costCenter
                  ) => (

                    <option
                      key={
                        costCenter._id
                      }

                      value={
                        costCenter._id
                      }
                    >

                      {
                        costCenter.costCenterCode
                      }{" "}
                      -{" "}
                      {
                        costCenter.costCenterName
                      }

                    </option>

                  )
                )}

              </Form.Select>

            </Col>

            <Col md={3}>

              <Form.Label>
                PO Type *
              </Form.Label>

              <Form.Select
                required

                value={
                  form.poType
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    poType:
                      event
                        .target
                        .value
                  })
                }
              >

                {PO_TYPES.map(
                  (
                    type
                  ) => (

                    <option
                      key={
                        type
                      }
                    >
                      {type}
                    </option>

                  )
                )}

              </Form.Select>

            </Col>

            <Col md={3}>

              <Form.Label>

                Project{" "}

                {form.poType ===
                  "Project" &&
                  "*"}

              </Form.Label>

              <Form.Select
                required={
                  form.poType ===
                  "Project"
                }

                value={
                  form.projectId
                }

                onChange={(
                  event
                ) => {

                  const projectId =
                    event
                      .target
                      .value;

                  const project =
                    (
                      projects
                        .data
                        ?.data ||
                      []
                    ).find(
                      (
                        item
                      ) =>
                        String(
                          item._id
                        ) ===
                        String(
                          projectId
                        )
                    );

                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      projectId,

                      header: {
                        ...current.header,

                        projectDocumentNo:
                          project
                            ?.projectDocumentNo ||
                          ""
                      }
                    })
                  );
                }}
              >

                <option value="">
                  Select / Not applicable
                </option>

                {(
                  projects
                    .data
                    ?.data ||
                  []
                ).map(
                  (
                    project
                  ) => (

                    <option
                      key={
                        project._id
                      }

                      value={
                        project._id
                      }
                    >

                      {
                        project.projectCode
                      }{" "}
                      -{" "}
                      {
                        project.projectName
                      }

                    </option>

                  )
                )}

              </Form.Select>

            </Col>

            

          </Row>

        </Card.Body>

      </Card>

      {/* =================================================
          2. COMMERCIAL / REFERENCE DETAILS
      ================================================= */}

      <Card className="border-0 shadow-sm mb-3">

        <Card.Header className="bg-white fw-bold py-3">

          2. Commercial / Reference Details

        </Card.Header>

        <Card.Body>

          <Row className="g-3">

            <Col md={4}>

              <Form.Label>
                Quote Ref Document No.
              </Form.Label>

              <Form.Control
                value={
                  form.header
                    .quoteRefDocumentNo
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      quoteRefDocumentNo:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

            <Col md={4}>

              <Form.Label>
                Document Type
              </Form.Label>

              <Form.Control
                value={
                  form.header
                    .documentType
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      documentType:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

            <Col md={4}>

              <Form.Label>
                Confirmed By
              </Form.Label>

              <Form.Control
                value={
                  form.header
                    .confirmedBy
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      confirmedBy:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

            <Col md={4}>

              <Form.Label>
                Project Document No.
              </Form.Label>

              <Form.Control
                value={
                  form.header
                    .projectDocumentNo
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      projectDocumentNo:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

            <Col md={4}>

              <Form.Label>
                Reference No.
              </Form.Label>

              <Form.Control
                value={
                  form.header
                    .referenceNo
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      referenceNo:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

            <Col md={4}>

              <Form.Label>
                Payment Term *
              </Form.Label>

              <Form.Select
                required

                value={
                  form.paymentTermId
                }

                onChange={(
                  event
                ) => {

                  const paymentTermId =
                    event
                      .target
                      .value;

                  const selectedPayment =
                    (
                      paymentTerms
                        .data
                        ?.data ||
                      []
                    ).find(
                      (
                        payment
                      ) =>
                        String(
                          payment._id
                        ) ===
                        String(
                          paymentTermId
                        )
                    );

                  const paymentSummary =
                    selectedPayment
                      ?.paymentSummary ||
                    "";

                  setForm(
                    (
                      current
                    ) => ({
                      ...current,

                      paymentTermId,

                      header: {
                        ...current.header,

                        paymentSummary
                      },

                      specificTerms:
                        current.specificTerms.map(
                          (
                            term
                          ) =>
                            isPaymentSpecificTerm(
                              term
                            )
                              ? {
                                  ...term,

                                  text:
                                    paymentSummary
                                }
                              : term
                        )
                    })
                  );
                }}
              >

                <option value="">
                  Select Payment Term
                </option>

                {(
                  paymentTerms
                    .data
                    ?.data ||
                  []
                ).map(
                  (
                    payment
                  ) => (

                    <option
                      key={
                        payment._id
                      }

                      value={
                        payment._id
                      }
                    >

                      {
                        payment.paymentCode
                      }{" "}
                      -{" "}
                      {
                        payment.paymentName
                      }

                    </option>

                  )
                )}

              </Form.Select>

            </Col>

            <Col md={4}>

              <Form.Label>
                Buyer Name *
              </Form.Label>

              <Form.Control
                required

                value={
                  form.header
                    .buyerName
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      buyerName:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

            <Col md={4}>

              <Form.Label>
                Buyer Contact
              </Form.Label>

              <Form.Control
                value={
                  form.header
                    .buyerContact
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      buyerContact:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

            {/* =================================================
                TAXES & DUTIES

                Dropdown added.

                Existing field name remains:
                header.taxesDutiesText
            ================================================= */}

            <Col md={4}>

              <Form.Label>
                Taxes & Duties
              </Form.Label>

              <Form.Select
                value={
                  form.header
                    .taxesDutiesText
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      taxesDutiesText:
                        event
                          .target
                          .value
                    }
                  })
                }
              >

                {TAXES_DUTIES_OPTIONS.map(
                  (option) => (

                    <option
                      key={
                        option
                      }

                      value={
                        option
                      }
                    >
                      {option}
                    </option>

                  )
                )}

              </Form.Select>

            </Col>

            <Col md={12}>

              <Form.Label>
                Supplier Tax Note
              </Form.Label>

              <Form.Control
                value={
                  form.header
                    .supplierTaxNote
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      supplierTaxNote:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

            <Col md={8}>

              <Form.Label>
                Special Notes
              </Form.Label>

              <Form.Control
                as="textarea"

                rows={2}

                value={
                  form.header
                    .specialNotes
                }

                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,

                    header: {
                      ...form.header,

                      specialNotes:
                        event
                          .target
                          .value
                    }
                  })
                }
              />

            </Col>

          </Row>

        </Card.Body>

      </Card>

      {/* =================================================
          3. PO ITEMS
      ================================================= */}

      <Card className="border-0 shadow-sm mb-3">

        <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">

          <strong>
            3. PO Items
          </strong>

          <Button
            type="button"

            size="sm"

            variant="outline-primary"

            onClick={
              addItem
            }
          >

            <i className="bi bi-plus-lg me-1" />

            Add Item

          </Button>

        </Card.Header>

        <Card.Body className="p-0">

          <div className="table-responsive">

            <Table className="align-middle mb-0 po-item-table">

              <thead className="table-light">

                <tr>

                  <th style={{ minWidth: 55 }}>
                    Sr.
                  </th>

                  <th style={{ minWidth: 260 }}>
                    Material
                  </th>

                  <th style={{ minWidth: 260 }}>
                    Description
                  </th>

                  <th>
                    HSN/SAC
                  </th>

                  <th>
                    UOM
                  </th>

                  <th style={{ minWidth: 110 }}>
                    Qty
                  </th>

                  <th style={{ minWidth: 140 }}>
                    Rate
                  </th>

                  <th>
                    GST%
                  </th>

                  <th style={{ minWidth: 130 }}>
                    Basic
                  </th>

                  <th style={{ minWidth: 140 }}>
                    Delivery
                  </th>

                  <th />

                </tr>

              </thead>

              <tbody>

                {form.items.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        index
                      }
                    >

                      <td>

                        {
                          (
                            index +
                            1
                          ) *
                          10
                        }

                      </td>

                      <td>

                        {item.manual ? (

                          <Form.Control
                            value={
                              item.materialCode
                            }

                            placeholder="Material code"

                            onChange={(
                              event
                            ) =>
                              patchItem(
                                index,
                                {
                                  materialCode:
                                    event
                                      .target
                                      .value
                                }
                              )
                            }
                          />

                        ) : (

                          <Form.Select
                            value={
                              item.materialId
                            }

                            onChange={(
                              event
                            ) =>
                              selectMaterial(
                                index,
                                event
                                  .target
                                  .value
                              )
                            }
                          >

                            <option value="">
                              Select material
                            </option>

                            {(
                              materials
                                .data
                                ?.data ||
                              []
                            ).map(
                              (
                                material
                              ) => (

                                <option
                                  key={
                                    material._id
                                  }

                                  value={
                                    material._id
                                  }
                                >

                                  {
                                    material.itemCode
                                  }{" "}
                                  -{" "}
                                  {
                                    material.description
                                  }

                                </option>

                              )
                            )}

                          </Form.Select>

                        )}

                        {can(
                          "po.manual_item"
                        ) && (

                          <Form.Check
                            className="mt-1"

                            type="switch"

                            label="Manual"

                            checked={
                              item.manual
                            }

                            onChange={(
                              event
                            ) =>
                              patchItem(
                                index,

                                event
                                  .target
                                  .checked
                                  ? {
                                      ...emptyItem(),

                                      manual:
                                        true
                                    }
                                  : {
                                      ...emptyItem(),

                                      manual:
                                        false
                                    }
                              )
                            }
                          />

                        )}

                      </td>

                      <td>

                        {item.manual ? (

                          <Form.Control
                            as="textarea"

                            rows={2}

                            value={
                              item.description
                            }

                            onChange={(
                              event
                            ) =>
                              patchItem(
                                index,
                                {
                                  description:
                                    event
                                      .target
                                      .value
                                }
                              )
                            }
                          />

                        ) : (

                          <div className="small">

                            {
                              item.description ||
                              "Select material"
                            }

                          </div>

                        )}

                      </td>

                      <td>

                        {item.manual ? (

                          <Form.Control
                            value={
                              item.hsnSac
                            }

                            onChange={(
                              event
                            ) =>
                              patchItem(
                                index,
                                {
                                  hsnSac:
                                    event
                                      .target
                                      .value
                                }
                              )
                            }
                          />

                        ) : (

                          item.hsnSac ||
                          "-"

                        )}

                      </td>

                      <td>

                        {item.manual ? (

                          <Form.Control
                            value={
                              item.uom
                            }

                            onChange={(
                              event
                            ) =>
                              patchItem(
                                index,
                                {
                                  uom:
                                    event
                                      .target
                                      .value
                                }
                              )
                            }
                          />

                        ) : (

                          item.uom ||
                          "-"

                        )}

                      </td>

                      <td>

                        <Form.Control
                          type="number"

                          min="0.000001"

                          step="any"

                          value={
                            item.qty
                          }

                          onChange={(
                            event
                          ) =>
                            patchItem(
                              index,
                              {
                                qty:
                                  event
                                    .target
                                    .value
                              }
                            )
                          }
                        />

                      </td>

                      <td>

                        <Form.Control
                          type="number"

                          min="0"

                          step="0.01"

                          value={
                            item.rate
                          }

                          onChange={(
                            event
                          ) =>
                            patchItem(
                              index,
                              {
                                rate:
                                  event
                                    .target
                                    .value
                              }
                            )
                          }
                        />

                      </td>

                      <td>

                        {item.manual ? (

                          <Form.Control
                            type="number"

                            min="0"

                            max="100"

                            step="0.01"

                            value={
                              item.gstPercent
                            }

                            onChange={(
                              event
                            ) =>
                              patchItem(
                                index,
                                {
                                  gstPercent:
                                    event
                                      .target
                                      .value
                                }
                              )
                            }
                          />

                        ) : (

                          item.gstPercent

                        )}

                      </td>

                      <td className="text-end fw-semibold">

                        {formatMoney(
                          calc.rows[
                            index
                          ]?.basic,

                          form.currency
                        )}

                      </td>

                      <td>

                        <Form.Control
                          type="date"

                          value={
                            item.deliveryDate ||
                            ""
                          }

                          onChange={(
                            event
                          ) =>
                            patchItem(
                              index,
                              {
                                deliveryDate:
                                  event
                                    .target
                                    .value
                              }
                            )
                          }
                        />

                      </td>

                      <td>

                        <Button
                          type="button"

                          variant="outline-danger"

                          size="sm"

                          onClick={() =>
                            removeItem(
                              index
                            )
                          }
                        >

                          <i className="bi bi-trash" />

                        </Button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </Table>

          </div>

        </Card.Body>

      </Card>

      {/* =================================================
          4. SPECIFIC TERMS + 5. TOTAL PREVIEW
      ================================================= */}

      <Row className="g-3 mb-3">

        <Col lg={7}>

          <Card className="border-0 shadow-sm h-100">

            <Card.Header className="bg-white fw-bold py-3">

              4. Specific PO Terms

            </Card.Header>

            <Card.Body>

              {form.specificTerms
                .length === 0 ? (

                <div className="text-secondary">

                  Active specific terms will be loaded automatically.

                </div>

              ) : (

                form.specificTerms.map(
                  (
                    term,
                    index
                  ) => (

                    <div
                      key={`${term.termCode || term.title}-${index}`}

                      className="mb-3"
                    >

                      <Form.Label className="fw-semibold">

                        {
                          term.displayOrder
                        }
                        .{" "}
                        {
                          term.title
                        }

                      </Form.Label>

                      <Form.Control
                        as="textarea"

                        rows={2}

                        value={
                          term.text ||
                          ""
                        }

                        onChange={(
                          event
                        ) =>
                          updateSpecificTerm(
                            index,
                            event
                              .target
                              .value
                          )
                        }
                      />

                    </div>

                  )
                )

              )}

            </Card.Body>

          </Card>

        </Col>

        <Col lg={5}>

          <Card className="border-0 shadow-sm h-100">

            <Card.Header className="bg-white fw-bold py-3">

              5. Total Preview

            </Card.Header>

            <Card.Body>

              <Row className="g-2 mb-3">

              </Row>

              <div className="totals-box">

                <div>

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    {formatMoney(
                      calc.sub,
                      form.currency
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    GST
                  </span>

                  <strong>
                    {formatMoney(
                      calc.tax,
                      form.currency
                    )}
                  </strong>

                </div>

                <div className="grand">

                  <span>
                    Estimated Grand Total
                  </span>

                  <strong>
                    {formatMoney(
                      calc.total,
                      form.currency
                    )}
                  </strong>

                </div>

              </div>

              <div className="small text-secondary mt-3">

                Packing & Forwarding and Freight Charges are maintained directly under Specific PO Terms.

              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>

      {/* =================================================
          BOTTOM ACTIONS
      ================================================= */}

      <div className="d-flex justify-content-end gap-2 pb-4">

        <Button
          type="button"

          variant="outline-secondary"

          onClick={() =>
            navigate(
              -1
            )
          }
        >

          Cancel

        </Button>

        <Button
          type="submit"

          size="lg"

          disabled={
            save.isPending
          }
        >

          <i className="bi bi-save me-2" />

          {save.isPending
            ? "Saving..."
            : editing
            ? "Update PO"
            : "Save Draft"}

        </Button>

      </div>

    </Form>
  );
}