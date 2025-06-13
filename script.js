document.addEventListener('DOMContentLoaded', () => {

    const FTE_HOURS_PER_YEAR = 2080;

    // --- DOM Elements ---
    const roleSelect = document.getElementById('roleSelect');
    const automationTypeSelect = document.getElementById('automationType');
    const moduleSelect = document.getElementById('moduleSelect');
    
    const scorecardBtn = document.getElementById('scorecardBtn');
    const qualificationBtn = document.getElementById('qualificationBtn');
    const discoveryBtn = document.getElementById('discoveryBtn');
    const roiBtn = document.getElementById('roiBtn');
    
    const contentArea = document.getElementById('contentArea');
    const scorecardSection = document.getElementById('scorecardSection');
    const qualificationSection = document.getElementById('qualificationSection');
    const discoverySection = document.getElementById('discoverySection');
    const roiSection = document.getElementById('roiSection');
    
    const exportBtn = document.getElementById('exportBtn');
    const clearFormBtn = document.getElementById('clearFormBtn');
    const exportSuccessMessage = document.getElementById('export-success-message');

    // --- Data and Configuration ---
    let state = {
        qualAdmin: {
            qualifiedThreshold: 8,
            clarificationThreshold: 5,
            defaults: {
                qualifiedThreshold: 8,
                clarificationThreshold: 5,
            }
        }
    };

    const scorecardQuestions = [
        { id: 'aligns', text: "Customer's business needs align to our capability." },
        { id: 'access', text: "We have access to all the key buying influences." },
        { id: 'coach', text: "We have at least one coach." },
        { id: 'differentiate', text: "We can differentiate our solution from the competition and demonstrate value." },
        { id: 'early', text: "Customer has engaged us early in the process." },
    ];
    
    const qualificationQuestions = {
        qualitative: [
            { id: 'painLevel', text: 'How significant is the business pain or challenge?', type: 'select', options: [{text: 'Select...', score: 0}, {text: 'Critical, stopping business', score: 3}, {text: 'Significant, causing major issues', score: 2}, {text: 'Moderate, an inconvenience', score: 1}, {text: 'Low, nice to have', score: 0}] },
            { id: 'decisionMaker', text: 'Do we have access to the economic decision-maker?', type: 'select', options: [{text: 'Select...', score: 0}, {text: 'Yes, they are our champion', score: 3}, {text: 'Yes, we have had meetings', score: 2}, {text: 'Identified, but no access yet', score: 1}, {text: 'No', score: 0}] },
            { id: 'champion', text: 'Have we identified and cultivated an internal champion?', type: 'select', options: [{text: 'Select...', score: 0}, {text: 'Yes, actively advocating for us', score: 3}, {text: 'Yes, but passive', score: 2}, {text: 'Potentially, but unconfirmed', score: 1}, {text: 'No champion identified', score: 0}] },
            { id: 'compellingEvent', text: 'Is there a compelling event driving the need for a decision?', type: 'select', options: [{text: 'Select...', score: 0}, {text: 'Yes, a hard deadline exists (e.g., system end-of-life, new regulation)', score: 3}, {text: 'Yes, a strong business driver (e.g., M&A, new market entry)', score: 2}, {text: 'Vague, based on general improvement goals', score: 1}, {text: 'None identified', score: 0}] },
        ],
        quantitative: [
             { id: 'budgetStatus', text: 'What is the status of the budget for this project?', type: 'select', options: [{text: 'Select...', score: 0}, {text: 'Approved and allocated', score: 3}, {text: 'Budget exists, not yet allocated', score: 2}, {text: 'Looking for budget', score: 1}, {text: 'No budget', score: 0}] },
             { id: 'timeline', text: 'What is the timeline for implementing a solution?', type: 'select', options: [{text: 'Select...', score: 0}, {text: 'Urgent, within 3 months', score: 3}, {text: 'This financial year, 3-9 months', score: 2}, {text: 'Next 12 months', score: 1}, {text: 'Researching, no fixed timeline', score: 0}] },
             { id: 'roiExpectation', text: 'Has the customer acknowledged the need for a positive ROI?', type: 'select', options: [{text: 'Select...', score: 0}, {text: 'Yes, and they have a target ROI/payback period', score: 3}, {text: 'Yes, conceptually acknowledged', score: 2}, {text: 'Unsure, not discussed', score: 1}, {text: 'No, focused only on features', score: 0}] },
             { id: 'technicalFit', text: 'How well does our solution fit their technical environment?', type: 'select', options: [{text: 'Select...', score: 0}, {text: 'Excellent, standard integration points confirmed', score: 3}, {text: 'Good, some minor customisation needed', score: 2}, {text: 'Feasible, but requires significant integration work', score: 1}, {text: 'Poor, major conflicts with existing architecture', score: 0}] },
        ]
    };
    
    // Fully configured questions for all modules
    const questions = {
        finance: {
            accountsPayable: {
                qualitative: ["Describe your current invoice approval workflow. What are the biggest bottlenecks?", "What is the biggest pain point in your current AP process?", "How do you currently handle exceptions and discrepancies in invoices?", "What is the impact of invoice processing delays on your financial reporting and supplier relationships?", "How do you ensure compliance with internal controls and audit trails for AP?", "Describe your process for onboarding new suppliers and managing their information.", "What systems are you currently using for accounting/ERP and invoice processing?", "What is your strategic vision for the future of your accounts payable function?", "How do you handle supplier inquiries about payment status, and how much time does this consume?", "What are the risks associated with your current AP process (e.g., fraud, errors)?"],
                quantitative: ["How many invoices do you process per month?", "What percentage of your invoices are received electronically vs. paper?", "What is your average cost to process a single invoice?", "How many FTEs are dedicated to the AP process?", "What is your on-time payment percentage for suppliers?", "What is the value of early payment discounts you miss annually?", "How much time does your team spend on manual data entry from invoices?", "What is the average time (in days) to get an invoice approved?", "How many people are typically involved in an invoice approval workflow?", "How many supplier payment-related inquiries do you receive per week?"]
            },
            orderManagement: {
                qualitative: ["Describe your end-to-end order management process, from receipt to fulfilment. Where are the primary bottlenecks?", "What are the most common reasons for order processing delays or errors?", "How do you handle complex orders, such as those with special pricing, custom configurations, or multiple delivery locations?", "What is the customer experience like when they inquire about an order status? How is that information accessed?", "How do you manage communication between sales, customer service, and fulfilment teams regarding orders?", "What is your process for handling order exceptions, such as credit holds, stock-outs, or shipping issues?", "How adaptable is your current process to new sales channels or business models (e.g., e-commerce, subscriptions)?", "What are the biggest challenges in providing customers with real-time visibility into their orders?", "How do you measure customer satisfaction with the order process?", "What is your strategic goal for improving the overall customer order experience?"],
                quantitative: ["How many sales orders do you process per month?", "What is the average number of lines per order?", "What percentage of orders are received manually (email, phone) vs. electronically (EDI, portal)?", "What is the average time (in minutes) required to manually enter one order?", "What is your current order accuracy rate (i.e., percentage of orders processed without any errors)?", "What is the average cost to remediate an order error (including shipping, returns, and labour)?", "How many FTEs are dedicated to manual order entry and processing?", "What is your average order cycle time (from receipt to ready-for-shipment) in hours?", "How many order status inquiries do you receive per week?", "What percentage of your orders result in a dispute or claim later in the process?"]
            },
            customerInquiry: {
                qualitative: ["What are the top 3-5 types of customer inquiries you receive most frequently?", "Describe the typical journey of a customer inquiry from the moment it's received to when it's resolved.", "How do your agents find the information needed to answer inquiries? What systems do they access?", "What is the process for handling an inquiry that the first agent cannot resolve?", "How do you ensure consistent and accurate answers are provided across your team and channels?", "What are the biggest frustrations for your agents when handling customer inquiries?", "How do you gather feedback from customers about their service experience?", "What is the impact on the business when inquiry resolution is slow or inaccurate?", "How do you identify trends or root causes from the inquiries you receive?", "What level of self-service capability do you currently offer customers to find answers themselves?"],
                quantitative: ["How many customer inquiries do you receive per month across all channels (email, phone, portal)?", "What is your average First Contact Resolution (FCR) rate?", "What is the average handling time (AHT) for an inquiry, in minutes?", "How many FTEs are dedicated to responding to customer inquiries?", "What is your target response time (SLA) for different inquiry types?", "What is your current Customer Satisfaction (CSAT) or Net Promoter Score (NPS) for customer service?", "What percentage of inquiries are escalated to a senior team member or manager?", "What is the cost of labour per inquiry (AHT * agent annual salary)?", "How many inquiries, on average, does a single agent handle per day?", "What is the ratio of inquiries to the number of orders or active customers?"]
            },
            cashApplication: {
                qualitative: ["Describe the process of matching a payment to open invoices. What makes this difficult?", "How do you receive remittance advice from customers? (e.g., email attachments, web portal downloads, EDI)", "What happens when a customer sends a payment without remittance information?", "How are deductions, short-pays, and other exceptions identified and coded during cash application?", "What is the impact on the collections team when cash is not applied promptly and accurately?", "How much manual effort is involved in processing lockbox files or bank statements?", "What are the main challenges in reconciling applied cash with your bank accounts?", "How does your current process handle payments that cover invoices across multiple business units or currencies?", "What visibility does the credit team have into a customer's payment status?", "What are the primary goals for improving your cash application process?"],
                quantitative: ["How many payments do you process per month?", "What percentage of payments are currently applied automatically (touch-free)?", "What is the average time (in minutes) to manually research and apply a single payment with exceptions?", "How many unapplied cash items are open at the end of an average month?", "What is the total value of unapplied cash at month-end?", "How many FTEs are dedicated to the cash application process?", "What are your bank lockbox fees per month/year?", "What percentage of remittance data needs to be manually keyed from a document or image?", "How many distinct ERPs or billing systems are you applying cash against?", "By how many days does manual cash application delay the update of a customer's true outstanding balance?"]
            },
            collectionManagement: {
                qualitative: ["Describe your standard collections strategy. How do you segment customers for different treatments?", "What triggers a collections activity for an overdue invoice?", "How do your collectors prioritise their work each day?", "What information do your collectors need to be effective, and how easily can they access it?", "How are disputes that are identified during collections routed and resolved?", "Describe the process for managing and tracking payment promises.", "How does the collections team collaborate with the sales department on sensitive accounts?", "What are the biggest challenges your collectors face in their day-to-day work?", "How do you measure the performance and effectiveness of your collections team?", "What is your approach to maintaining positive customer relationships while collecting debt?"],
                quantitative: ["What is your current average Days Sales Outstanding (DSO)?", "What is the total value of your accounts receivable over 90 days past due?", "How many FTEs are dedicated to collections activities?", "What is your Collection Effectiveness Index (CEI)?", "What is the average number of collection 'touches' (calls, emails) per month?", "What percentage of your AR portfolio is typically past due?", "What is the total amount of bad debt you write off annually?", "What is the cost of third-party collection agency fees per year?", "How much time do collectors spend on administrative tasks (e.g., preparing reports, finding contact info) vs. actual customer contact?", "What percentage of disputes are identified through collections activities?"]
            },
            creditManagement: {
                 qualitative: ["Describe your process for assessing a new customer's creditworthiness. What information do you use?", "How are credit limits determined and reviewed?", "What is the process for placing a customer on credit hold, and what is the business impact?", "How do you balance the need for sales growth with the risk of bad debt?", "How does the credit team communicate with sales and customer service?", "What are the biggest challenges in getting timely and accurate credit information?", "How do you monitor the credit risk of your existing customer base?", "What tools or systems are used for credit management today?", "How do you handle credit management for international customers or different business units?", "What is your long-term strategy for proactive credit risk management?"],
                 quantitative: ["How many new credit applications do you process per month?", "What is the average time (in hours or days) to approve a new credit application?", "How many FTEs are dedicated to credit management?", "What is your total annual bad debt write-off amount?", "What percentage of your revenue is impacted by orders on credit hold each month?", "How often are customer credit limits reviewed?", "What is the cost of your third-party credit reporting services annually?", "What percentage of credit decisions are fully automated vs. requiring manual review?", "How many credit limit increase requests do you process per month?", "What is the value of sales orders lost or delayed due to slow credit approvals?"]
            },
            claimsDeductions: {
                qualitative: ["What are the most common types of claims and deductions you deal with (e.g., shortages, promotions, pricing)?", "Describe the process from when a deduction is taken by a customer to when it is resolved.", "How do you gather the necessary backup documentation (e.g., proof of delivery, promotional agreements) to validate a claim?", "What are the biggest challenges in identifying the root cause of deductions?", "How do you collaborate with other departments (sales, logistics) to resolve claims?", "What is the process for disputing and recovering invalid deductions?", "What visibility do you have into deduction trends and their financial impact?", "How much manual effort is involved in coding and processing deductions in your ERP?", "What is the impact of unresolved deductions on your cash flow and DSO?", "What are your strategic goals for reducing the overall volume of claims and deductions?"],
                quantitative: ["How many deductions do you process per month?", "What is the total dollar value of deductions processed per month?", "What percentage of deductions are eventually determined to be invalid?", "Of the invalid deductions, what percentage are successfully recovered?", "What is the average time (in days) to resolve a deduction from start to finish (DDO)?", "How many FTEs are dedicated to managing claims and deductions?", "What is the average value of a single deduction?", "What is the value of promotional deductions vs. non-promotional deductions?", "How much time is spent manually researching a single complex deduction?", "What is the value of deductions written off each year?"]
            },
             expenseManagement: {
                qualitative: ["Describe your current expense reporting process for employees. What are their biggest frustrations?", "What is the approval workflow for an expense report? Where are the typical delays?", "How do you ensure expense claims comply with company policy?", "What are the challenges with collecting and managing physical receipts?", "How is corporate credit card data reconciled with expense reports?", "What visibility does the finance team have into employee spend before it's been reported?", "How do you handle out-of-policy expense requests or exceptions?", "What are the biggest pain points for your AP/finance team when processing expense reports?", "How do you analyse spending patterns to identify potential savings or policy improvements?", "What is your strategy for improving the employee experience and control around T&E spending?"],
                quantitative: ["How many expense reports do you process per month?", "What is the average number of line items per expense report?", "How long does it take an employee, on average, to complete and submit an expense report (in minutes)?", "How long does it take for an expense report to be fully processed and reimbursed (in days)?", "What is the average cost to process a single expense report?", "How many FTEs in your finance/AP team are involved in processing expense reports?", "What percentage of expense reports are returned to employees for correction?", "What is the value of out-of-policy spend identified per year?", "How much is spent on overnight shipping for receipts or reports?", "What percentage of expenses are submitted via a mobile device?"]
            },
             procurement: {
                qualitative: ["Describe your procure-to-pay (P2P) process from requisition to payment. Where are the biggest challenges?", "How do employees request goods or services? Is there a standard, easy-to-use process?", "What is your approval process for purchase requisitions?", "How do you ensure employees are buying from preferred suppliers at negotiated prices?", "What are the main causes of 'maverick' or off-contract spending?", "How do you manage supplier catalogs and ensure pricing is up-to-date?", "What is the process for creating a purchase order after a requisition is approved?", "How do you track goods receipt against purchase orders?", "What are the biggest challenges in matching invoices to purchase orders (2-way or 3-way match)?", "What are your key goals for gaining better control and visibility over company spend?"],
                quantitative: ["How many purchase requisitions/orders do you process per month?", "What is the average cost to process a single purchase order?", "What percentage of your indirect spend is 'maverick' or off-contract?", "How many FTEs are involved in the procurement and PO processing function?", "What is your PO-to-invoice match rate?", "How much time is spent manually correcting PO or invoice mismatch errors?", "What percentage of your spend is with your top 10 suppliers?", "What is the average cycle time from requisition to PO dispatch (in days)?", "How many suppliers are in your active master file?", "What is the value of missed volume discounts or rebates annually?"]
            },
            invoiceDelivery: {
                qualitative: ["Describe your process for creating and sending customer invoices. Is it automated or manual?", "What different formats and delivery channels do you need to support for your customers (e.g., print, email PDF, portal upload, EDI)?", "What are the biggest challenges in meeting diverse customer e-invoicing requirements?", "How do you handle and track invoice delivery failures or rejections?", "What is the customer experience when they have a question about an invoice they've received?", "How much manual effort is involved in posting invoices to customer AP portals?", "What visibility do you have to confirm that a customer has actually received and viewed their invoice?", "How does your invoice delivery process impact your Days Sales Outstanding (DSO)?", "What are the main reasons for invoice disputes, and could they be prevented at the delivery stage?", "What is your strategy for migrating more customers from paper to electronic invoicing?"],
                quantitative: ["How many customer invoices do you send per month?", "What is the average cost to print and mail a single paper invoice?", "What percentage of your invoices are sent electronically (email, EDI, portal)?", "How many FTEs are involved in the invoice creation and delivery process?", "How many customer AP portals do you have to manually upload invoices into?", "What is the error rate for invoices that are rejected by customers due to formatting or data issues?", "How much time (in minutes) is spent on average resolving a single delivery failure?", "What is your current average DSO?", "How many customer inquiries are related to not having received an invoice?", "What is the cost of materials (paper, envelopes, toner) for invoicing per year?"]
            },
            supplierManagement: {
                qualitative: ["Describe your process for onboarding a new supplier. What information do you collect and how?", "How do you manage and maintain the accuracy of your supplier master data?", "What are the biggest risks associated with your current supplier onboarding process (e.g., fraud, compliance)?", "How do you manage supplier compliance documents (e.g., certificates of insurance, tax forms)?", "What is the process for suppliers to update their information (e.g., bank details, address)?", "How do you segment your suppliers and manage relationships with strategic partners?", "What level of self-service capability do you offer your suppliers?", "How do you communicate with your supplier base about policies, performance, or other important updates?", "What are the main challenges in ensuring a single, accurate view of each supplier across your organisation?", "What are your primary goals for improving supplier collaboration and reducing supply chain risk?"],
                quantitative: ["How many active suppliers are in your master file?", "How many new suppliers do you onboard per year?", "How long does it take (in days) to fully onboard a new supplier?", "How many FTEs are involved in managing supplier data and onboarding?", "What percentage of your supplier records are estimated to be duplicates or contain outdated information?", "How many fraudulent or incorrect supplier payments have you experienced in the last year?", "What is the average time (in hours) spent manually verifying a new supplier's details?", "How many supplier-related inquiries (e.g., 'update my details') do you handle per week?", "What percentage of your suppliers are onboarded via a self-service portal vs. manually?", "What is the cost associated with a single payment error due to incorrect supplier data?"]
            }
        },
        business: {
            documentManagement: {
                qualitative: ["How are your critical business documents currently stored and organised, and what are the challenges with that approach?", "Describe the process for reviewing and approving documents. Where are the bottlenecks?", "What are the consequences of not being able to find a document when needed?", "How do you control access to sensitive documents and what are your concerns around security?", "Describe your process for collaborating on documents with both internal and external stakeholders.", "What are the challenges with accessing documents when working remotely or on mobile devices?", "How do you manage document retention and disposal policies for compliance?", "What integrations exist between your current document storage and other business systems (e.g., CRM, ERP)?", "What is your process for onboarding a new employee and giving them access to the right information?", "What are your top 3 goals for improving how you manage your organisation's information and documents?"],
                quantitative: ["What is the estimated volume of new documents created or received daily/weekly?", "How much time do employees spend searching for documents on average per week?", "What is the total number of employees who regularly handle or search for documents?", "How much physical office space (in square metres) is dedicated to paper document storage?", "What is the annual cost of offsite document storage, if any?", "How many compliance or audit-related requests for documents do you handle per year?", "What is the estimated cost of a single compliance breach related to document mismanagement?", "What is the annual cost of printing, copying, and mailing documents?", "What is the error rate (%) for documents filed or processed manually?", "How long (in days) is the average lifecycle of a contract from creation to signature?"]
            },
            workflowManagement: {
                qualitative: ["Which of your current business processes are the most manual and time-consuming?", "Describe a key approval process (e.g., CapEx request, new hire onboarding, contract review). Where are the delays?", "How are tasks and responsibilities assigned and tracked in your current workflows?", "What is the visibility into the status of a process? Can you easily see where a task is stuck?", "How do you handle exceptions or deviations from the standard process?", "What is the employee experience like when they have to participate in these manual processes?", "How easy or difficult is it to change an existing process when business needs evolve?", "How do you ensure processes are followed consistently and comply with internal policies?", "What is the impact of process bottlenecks on your department's or the company's goals?", "What are your key objectives for implementing workflow automation?"],
                quantitative: ["How many forms or requests are processed manually per month for a key workflow?", "What is the average end-to-end cycle time for that workflow (in days or hours)?", "What is the error rate (%) for tasks completed manually within the process?", "How many FTEs are involved in managing or executing this specific workflow?", "How much time do managers spend on average approving or re-routing tasks per week?", "What is the cost associated with errors or rework in this process annually?", "How many email follow-ups or status update requests occur for a single instance of the workflow?", "What is the volume of documents associated with this process?", "How long does it take to audit a completed process?", "What is the estimated productivity loss (in hours per year) due to process inefficiencies?"]
            },
            processMapping: {
                qualitative: ["How are your business processes currently documented, if at all?", "Who is responsible for defining and maintaining process knowledge in your organisation?", "How do you onboard and train new employees on your standard operating procedures?", "When a process needs to be improved, what is the first step you take?", "How do you foster collaboration between different departments when designing or changing a process?", "What are the challenges in getting a single, agreed-upon view of how a process actually works?", "How do you identify risks, inefficiencies, or compliance gaps in your current processes?", "What is the 'go-to' source for employees when they have a question about how to perform a task?", "How do you manage and communicate process changes to the entire organisation?", "What are your primary goals for undertaking a process mapping initiative?"],
                quantitative: ["How many core business processes are currently undocumented or have outdated documentation?", "How much time (in hours) is typically spent in workshops and interviews to understand a single complex process?", "What is the estimated cost of a failed process improvement project due to poor initial understanding?", "How many different versions of the 'same' process exist across different teams or locations?", "On average, how long does it take for a new hire to become fully proficient in a key process?", "How many process-related errors or issues are reported per month?", "What is the annual budget for external consultants for process improvement initiatives?", "How many hours per year does management spend resolving issues caused by process ambiguity?", "What percentage of your IT projects are delayed due to unclear process requirements?", "How many compliance or audit findings in the last year were related to inconsistent process execution?"]
            }
        }
    };

    const roiQuestions = {
        finance: {
            accountsPayable: {
                demoData: { invoicesPerMonth: 1500, timePerInvoice: 12, annualSalary: 65000, errorPercentage: 15, exceptionTime: 30, missedDiscounts: 25000, storageCost: 5000 },
                formulas: [
                    { name: 'Manual Processing Labour Savings', id: 'manualProcessing', inputs: { invoicesPerMonth: 'invoicesPerMonth', timePerInvoice: 'timePerInvoice', annualSalary: 'annualSalary' },
                      formula: (i) => (i.invoicesPerMonth * 12 * (i.timePerInvoice * 0.8) / 60) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Reduced labour by 80%. (${i.invoicesPerMonth * 12} invoices/yr * ${i.timePerInvoice * 0.8} min saved/invoice / 60) * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Exception Handling Savings', id: 'exceptionHandling', inputs: { invoicesPerMonth: 'invoicesPerMonth', errorPercentage: 'errorPercentage', exceptionTime: 'exceptionTime', annualSalary: 'annualSalary' },
                      formula: (i) => (i.invoicesPerMonth * 12 * (i.errorPercentage / 100) * 0.75 * (i.exceptionTime / 60)) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Reduced exception handling by 75%. (${i.invoicesPerMonth * 12 * (i.errorPercentage / 100) * 0.75} exceptions * ${i.exceptionTime} min/exception / 60) * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Early Payment Discount Capture', id: 'discountCapture', inputs: { missedDiscounts: 'missedDiscounts' },
                      formula: (i) => i.missedDiscounts * 0.90,
                      description: (i) => `Captured 90% of missed discounts. $${i.missedDiscounts} * 0.9`},
                    { name: 'Eliminated Storage Costs', id: 'storageSavings', inputs: { storageCost: 'storageCost' },
                      formula: (i) => i.storageCost,
                      description: (i) => `Eliminated physical storage costs of $${i.storageCost}`},
                ]
            },
            orderManagement: {
                demoData: { ordersPerMonth: 2000, timePerOrder: 15, annualSalary: 60000, errorRate: 5, reworkCost: 50 },
                formulas: [
                    { name: 'Manual Order Entry Savings', id: 'orderEntry', inputs: { ordersPerMonth: 'ordersPerMonth', timePerOrder: 'timePerOrder', annualSalary: 'annualSalary'},
                      formula: (i) => (i.ordersPerMonth * 12 * (i.timePerOrder * 0.85) / 60) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Reduced manual entry time by 85%. (${i.ordersPerMonth * 12} orders/yr * ${i.timePerOrder * 0.85} min saved/order / 60) * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr` },
                    { name: 'Order Error Reduction Savings', id: 'errorReduction', inputs: { ordersPerMonth: 'ordersPerMonth', errorRate: 'errorRate', reworkCost: 'reworkCost'},
                      formula: (i) => (i.ordersPerMonth * 12 * (i.errorRate/100) * 0.9) * i.reworkCost,
                      description: (i) => `Reduced order errors by 90%. (${i.ordersPerMonth*12} orders/yr * ${i.errorRate}% * 0.9) * $${i.reworkCost}/error` }
                ]
            },
            customerInquiry: {
                 demoData: { inquiriesPerMonth: 3000, handleTime: 10, annualSalary: 58000, fcrRate: 70 },
                 formulas: [
                     { name: 'Agent Time Savings on Repetitive Inquiries', id: 'agentTime', inputs: { inquiriesPerMonth: 'inquiriesPerMonth', handleTime: 'handleTime', annualSalary: 'annualSalary' },
                       formula: (i) => (i.inquiriesPerMonth * 12 * 0.6) * (i.handleTime * 0.7) / 60 * (i.annualSalary / FTE_HOURS_PER_YEAR),
                       description: (i) => `Automated 60% of inquiries, reducing handle time by 70%. (${i.inquiriesPerMonth*12*0.6} inquiries * ${i.handleTime*0.7} min/inquiry / 60) * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                     { name: 'Improved First Contact Resolution (FCR)', id: 'fcrImprovement', inputs: { inquiriesPerMonth: 'inquiriesPerMonth', fcrRate: 'fcrRate', handleTime: 'handleTime', annualSalary: 'annualSalary' },
                        formula: (i) => (i.inquiriesPerMonth * 12 * ((100-i.fcrRate)/100) * 0.5) * i.handleTime/60 * (i.annualSalary / FTE_HOURS_PER_YEAR),
                        description: (i) => `Reduced repeat inquiries by 50%. (${i.inquiriesPerMonth*12} * ${100-i.fcrRate}% repeats * 0.5) * ${i.handleTime} min/inquiry * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr` }
                 ]
            },
            cashApplication: {
                demoData: { paymentsPerMonth: 5000, manualTime: 5, annualSalary: 62000, unappliedRate: 10 },
                formulas: [
                    { name: 'Reduced Manual Application Labour', id: 'manualLabour', inputs: { paymentsPerMonth: 'paymentsPerMonth', manualTime: 'manualTime', annualSalary: 'annualSalary' },
                      formula: (i) => (i.paymentsPerMonth * 12 * 0.8) * (i.manualTime / 60) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Automated 80% of manual applications. (${i.paymentsPerMonth*12*0.8} payments * ${i.manualTime} min/payment / 60) * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Faster Resolution of Unapplied Cash', id: 'unappliedCash', inputs: { paymentsPerMonth: 'paymentsPerMonth', unappliedRate: 'unappliedRate', annualSalary: 'annualSalary' },
                      formula: (i) => (i.paymentsPerMonth * 12 * (i.unappliedRate/100) * 0.9) * (1 * (i.annualSalary / FTE_HOURS_PER_YEAR)), // Assume 1 hr saved per item
                      description: (i) => `Reduced unapplied cash resolution time by 90%. (${i.paymentsPerMonth*12*(i.unappliedRate/100)*0.9} items * 1 hr saved * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr)`}
                ]
            },
             collectionManagement: {
                demoData: { totalRevenue: 50000000, dso: 45, collectors: 4, annualSalary: 70000, badDebt: 50000 },
                formulas: [
                    { name: 'DSO Reduction Cashflow Benefit', id: 'dsoReduction', inputs: { totalRevenue: 'totalRevenue', dso: 'dso'},
                      formula: (i) => (i.totalRevenue / 365) * 5 * 0.05, // 5 day reduction, 5% cost of capital
                      description: (i) => `Improved cash flow from 5-day DSO reduction. ($${i.totalRevenue}/yr / 365 days) * 5 days * 5% cost of capital`},
                    { name: 'Increased Collector Productivity', id: 'collectorProd', inputs: { collectors: 'collectors', annualSalary: 'annualSalary' },
                      formula: (i) => (i.collectors * FTE_HOURS_PER_YEAR * 0.25) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Increased productivity by 25%. (${i.collectors} collectors * ${FTE_HOURS_PER_YEAR} hrs/yr * 0.25) * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Bad Debt Reduction', id: 'badDebtReduction', inputs: { badDebt: 'badDebt' },
                       formula: (i) => i.badDebt * 0.15,
                       description: (i) => `Reduced bad debt write-offs by 15%. $${i.badDebt} * 0.15` }
                ]
            },
             creditManagement: {
                demoData: { creditApps: 100, timePerApp: 4, annualSalary: 75000, badDebt: 80000 },
                formulas: [
                    { name: 'Credit Approval Process Automation', id: 'approvalTime', inputs: { creditApps: 'creditApps', timePerApp: 'timePerApp', annualSalary: 'annualSalary'},
                      formula: (i) => (i.creditApps * 12 * (i.timePerApp * 0.8)) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Reduced credit processing time by 80%. (${i.creditApps*12} apps/yr * ${i.timePerApp*0.8} hrs saved) * $${(i.annualSalary/FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Bad Debt Reduction from Better Risk Analysis', id: 'badDebtImproved', inputs: { badDebt: 'badDebt'},
                      formula: (i) => i.badDebt * 0.20,
                      description: (i) => `Reduced bad debt by 20% through better risk analysis. $${i.badDebt} * 0.20`}
                ]
            },
            claimsDeductions: {
                demoData: { deductions: 500, timePerDeduction: 2, annualSalary: 65000, invalidRate: 30, totalDeductionValue: 250000 },
                formulas: [
                    { name: 'Deduction Research & Processing Automation', id: 'deductionProcessing', inputs: { deductions: 'deductions', timePerDeduction: 'timePerDeduction', annualSalary: 'annualSalary'},
                      formula: (i) => (i.deductions * 12 * (i.timePerDeduction * 0.75)) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Reduced research time by 75%. (${i.deductions*12} deductions/yr * ${i.timePerDeduction*0.75} hrs saved) * $${(i.annualSalary/FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Improved Invalid Deduction Recovery', id: 'deductionRecovery', inputs: { totalDeductionValue: 'totalDeductionValue', invalidRate: 'invalidRate' },
                      formula: (i) => (i.totalDeductionValue * 12 * (i.invalidRate/100)) * 0.50, // Recover 50% of what was previously lost
                      description: (i) => `Increased recovery of invalid deductions by 50%. ($${i.totalDeductionValue*12} total value * ${i.invalidRate}% invalid) * 50% recovery`}
                ]
            },
            expenseManagement: {
                 demoData: { reports: 1000, timePerReport: 20, annualSalary: 60000, nonCompliantRate: 15, avgReportValue: 300 },
                 formulas: [
                     { name: 'Expense Report Processing Time Savings', id: 'expenseProcessing', inputs: { reports: 'reports', timePerReport: 'timePerReport', annualSalary: 'annualSalary'},
                       formula: (i) => (i.reports * 12 * (i.timePerReport * 0.8) / 60) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                       description: (i) => `Reduced processing time by 80%. (${i.reports*12} reports/yr * ${i.timePerReport*0.8} min saved / 60) * $${(i.annualSalary/FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                     { name: 'Improved Policy Compliance Savings', id: 'expenseCompliance', inputs: { reports: 'reports', avgReportValue: 'avgReportValue', nonCompliantRate: 'nonCompliantRate'},
                       formula: (i) => (i.reports * 12 * i.avgReportValue * (i.nonCompliantRate/100) * 0.7), // Reduce non-compliant spend by 70%
                       description: (i) => `Reduced non-compliant spend by 70%. ($${i.reports*12*i.avgReportValue} total value * ${i.nonCompliantRate}% non-compliant * 0.7)`}
                 ]
            },
            procurement: {
                demoData: { pos: 1000, timePerPO: 30, annualSalary: 70000, maverickSpend: 10, annualSpend: 5000000 },
                formulas: [
                    { name: 'PO Processing Automation', id: 'poProcessing', inputs: { pos: 'pos', timePerPO: 'timePerPO', annualSalary: 'annualSalary'},
                      formula: (i) => (i.pos * 12 * (i.timePerPO * 0.8) / 60) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Reduced PO processing time by 80%. (${i.pos*12} POs/yr * ${i.timePerPO*0.8} min saved / 60) * $${(i.annualSalary/FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Maverick Spend Reduction', id: 'maverickSpendReduction', inputs: { annualSpend: 'annualSpend', maverickSpend: 'maverickSpend'},
                      formula: (i) => (i.annualSpend * (i.maverickSpend/100) * 0.05 * 0.8), // Assume 5% is the premium paid, and we reduce it by 80%
                      description: (i) => `Reduced maverick spend premium by 80%. ($${i.annualSpend} * ${i.maverickSpend}% maverick * 5% premium) * 80% reduction`}
                ]
            },
            invoiceDelivery: {
                demoData: { invoices: 10000, annualSalary: 55000, portalUploads: 500, printCost: 1.50},
                formulas: [
                     { name: 'Manual AP Portal Upload Automation', id: 'portalAutomation', inputs: { portalUploads: 'portalUploads', annualSalary: 'annualSalary'},
                       formula: (i) => (i.portalUploads * 12 * 5 / 60) * (i.annualSalary/FTE_HOURS_PER_YEAR), // Assume 5 mins per upload
                       description: (i) => `Automated portal uploads. (${i.portalUploads*12} uploads/yr * 5 min saved / 60) * $${(i.annualSalary/FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                     { name: 'Print and Postage Elimination', id: 'printElimination', inputs: { invoices: 'invoices', printCost: 'printCost'},
                       formula: (i) => (i.invoices * 12 * 0.7) * i.printCost, // Assume 70% of invoices can be moved to electronic
                       description: (i) => `Moved 70% of invoices from print to electronic. (${i.invoices*12*0.7} invoices * $${i.printCost})`}
                ]
            },
            supplierManagement: {
                 demoData: { newSuppliers: 200, timeToOnboard: 8, annualSalary: 68000, complianceIssues: 10, issueCost: 5000},
                 formulas: [
                    { name: 'Supplier Onboarding Automation', id: 'onboarding', inputs: { newSuppliers: 'newSuppliers', timeToOnboard: 'timeToOnboard', annualSalary: 'annualSalary' },
                      formula: (i) => (i.newSuppliers * (i.timeToOnboard * 0.75)) * (i.annualSalary/FTE_HOURS_PER_YEAR),
                      description: (i) => `Reduced onboarding time by 75%. (${i.newSuppliers} suppliers/yr * ${i.timeToOnboard*0.75} hrs saved) * $${(i.annualSalary/FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Reduced Compliance Risk', id: 'complianceRisk', inputs: { complianceIssues: 'complianceIssues', issueCost: 'issueCost'},
                      formula: (i) => (i.complianceIssues * i.issueCost) * 0.8, // Reduce issues by 80%
                      description: (i) => `Reduced compliance issues by 80%. (${i.complianceIssues} issues/yr * $${i.issueCost}/issue) * 80% reduction`}
                 ]
            }
        },
        business: {
            documentManagement: {
                 demoData: { docEmployees: 250, searchTime: 5, annualSalary: 75000, docStorageCost: 15000, complianceIncidents: 2, incidentCost: 25000, printingCost: 10000 },
                 formulas: [
                    { name: 'Productivity Gain from Reduced Search Time', id: 'searchTime', inputs: {docEmployees:'docEmployees', searchTime:'searchTime', annualSalary: 'annualSalary'},
                      formula: (i) => i.docEmployees * i.searchTime * 50 * (i.annualSalary/FTE_HOURS_PER_YEAR) * 0.85,
                      description: (i) => `Saved 85% of time searching. (${i.docEmployees} employees * ${i.searchTime} hrs/wk * 50 wks * $${(i.annualSalary/FTE_HOURS_PER_YEAR).toFixed(2)}/hr * 0.85)`},
                    { name: 'Physical Storage Cost Savings', id: 'storageSavings', inputs: {docStorageCost: 'docStorageCost'},
                      formula: (i) => i.docStorageCost,
                      description: (i) => `Eliminated offsite storage costs of $${i.docStorageCost}`},
                    { name: 'Compliance Risk Reduction', id: 'complianceSavings', inputs: {complianceIncidents: 'complianceIncidents', incidentCost: 'incidentCost'},
                      formula: (i) => (i.complianceIncidents / 2) * i.incidentCost * 0.9,
                      description: (i) => `Reduced risk by 90%. (${i.complianceIncidents}/2 incidents/yr * $${i.incidentCost}/incident * 0.9)`},
                    { name: 'Printing and Mailing Savings', id: 'printingSavings', inputs: {printingCost: 'printingCost'},
                      formula: (i) => i.printingCost,
                      description: (i) => `Eliminated printing & mailing costs of $${i.printingCost}`},
                 ]
            },
            workflowManagement: {
                demoData: { manualProcesses: 10, timePerProcess: 8, processVolume: 50, annualSalary: 70000, errorRate: 10, errorCost: 100 },
                formulas: [
                     { name: 'Process Cycle Time Reduction', id: 'cycleTime', inputs: { manualProcesses: 'manualProcesses', timePerProcess: 'timePerProcess', processVolume: 'processVolume', annualSalary: 'annualSalary' },
                       formula: (i) => (i.processVolume * 12) * (i.timePerProcess * 0.75) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                       description: (i) => `Reduced cycle time by 75%. (${i.processVolume*12} instances/yr * ${i.timePerProcess*0.75} hrs saved) * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                     { name: 'Error Reduction Savings', id: 'errorReduction', inputs: { processVolume: 'processVolume', errorRate: 'errorRate', errorCost: 'errorCost' },
                       formula: (i) => (i.processVolume*12 * (i.errorRate/100) * 0.9) * i.errorCost,
                       description: (i) => `Reduced errors by 90%. (${i.processVolume*12* (i.errorRate/100)*0.9} errors avoided * $${i.errorCost}/error)`}
                ]
            },
            processMapping: {
                 demoData: { projects: 5, discoveryTime: 100, annualSalary: 90000, failRate: 20, failCost: 50000 },
                 formulas: [
                    { name: 'Reduced Process Discovery Time', id: 'discoveryTime', inputs: { projects: 'projects', discoveryTime: 'discoveryTime', annualSalary: 'annualSalary'},
                      formula: (i) => i.projects * (i.discoveryTime * 0.5) * (i.annualSalary / FTE_HOURS_PER_YEAR),
                      description: (i) => `Reduced discovery time by 50%. (${i.projects} projects * ${i.discoveryTime*0.5} hrs saved) * $${(i.annualSalary / FTE_HOURS_PER_YEAR).toFixed(2)}/hr`},
                    { name: 'Reduced Project Failure/Rework', id: 'projectFailure', inputs: { projects: 'projects', failRate: 'failRate', failCost: 'failCost'},
                      formula: (i) => (i.projects * (i.failRate/100) * 0.75) * i.failCost,
                      description: (i) => `Reduced project failure rate by 75%. (${i.projects*(i.failRate/100)*0.75} projects) * $${i.failCost}/project`}
                 ]
            }
        }
    };

    const modules = {
        finance: {
            accountsPayable: 'Accounts Payable',
            orderManagement: 'Order Management',
            customerInquiry: 'Customer Inquiry Management',
            cashApplication: 'Cash Application',
            collectionManagement: 'Collection Management',
            creditManagement: 'Credit Management',
            claimsDeductions: 'Claims & Deductions',
            expenseManagement: 'Expense Management',
            procurement: 'Procurement',
            invoiceDelivery: 'Invoice Delivery',
            supplierManagement: 'Supplier Management',
        },
        business: {
            documentManagement: 'Document Management',
            workflowManagement: 'Workflow Management',
            processMapping: 'Process Mapping',
        }
    };

    const metricLabels = {
        // Shared
        annualSalary: "Average annual salary of relevant staff ($)?",
        // AP
        invoicesPerMonth: "Number of invoices per month?",
        timePerInvoice: "Avg. manual processing time per invoice (mins)?",
        errorPercentage: "Current invoice error/exception rate (%)?",
        exceptionTime: "Avg. time to resolve an exception (mins)?",
        missedDiscounts: "Annual value of missed early payment discounts ($)?",
        storageCost: "Annual cost of physical invoice storage ($)?",
        // OM
        ordersPerMonth: "Number of sales orders per month?",
        timePerOrder: "Avg. manual order entry time (mins)?",
        errorRate: "Current order error rate (%)?",
        reworkCost: "Avg. cost to rework an order error ($)?",
        // CI
        inquiriesPerMonth: "Number of customer inquiries per month?",
        handleTime: "Avg. handling time per inquiry (mins)?",
        fcrRate: "Current First Contact Resolution rate (%)?",
        // CA
        paymentsPerMonth: "Number of payments processed per month?",
        manualTime: "Avg. manual application time per payment (mins)?",
        unappliedRate: "Percentage of payments unapplied initially (%)?",
        // Collections
        totalRevenue: "Total annual revenue ($)?",
        dso: "Current Days Sales Outstanding (DSO)?",
        collectors: "Number of collections FTEs?",
        badDebt: "Annual bad debt write-off ($)?",
        // Credit
        creditApps: "New credit applications per month?",
        timePerApp: "Avg. time to approve a credit app (hrs)?",
        // Claims
        deductions: "Deductions processed per month?",
        timePerDeduction: "Avg. research time per deduction (hrs)?",
        invalidRate: "Percentage of deductions that are invalid?",
        totalDeductionValue: "Total value of deductions per month?",
        // Expense
        reports: "Expense reports per month?",
        timePerReport: "Avg. processing time per report (mins)?",
        nonCompliantRate: "Non-compliant expense rate (%)?",
        avgReportValue: "Average expense report value ($)?",
        // Procurement
        pos: "Purchase Orders per month?",
        timePerPO: "Avg. processing time per PO (mins)?",
        maverickSpend: "Maverick spend rate (%)?",
        annualSpend: "Total annual spend ($)?",
        // Invoice Delivery
        invoices: "Invoices sent per month?",
        portalUploads: "Number of manual AP portal uploads per month?",
        printCost: "Avg. cost to print & mail an invoice ($)?",
        // Supplier
        newSuppliers: "New suppliers onboarded per year?",
        timeToOnboard: "Avg. time to onboard a supplier (hrs)?",
        complianceIssues: "Compliance issues per year?",
        issueCost: "Avg. cost per compliance issue ($)?",
        // Business
        docEmployees: "Number of employees handling documents?",
        searchTime: "Avg. hours/week employees spend searching for documents?",
        docStorageCost: "Annual physical document storage cost ($)?",
        complianceIncidents: "Compliance incidents in last 2 years?",
        incidentCost: "Avg. cost per compliance incident ($)?",
        printingCost: "Annual printing & mailing cost ($)?",
        manualProcesses: "Number of key manual workflows?",
        timePerProcess: "Avg. cycle time per workflow instance (hrs)?",
        processVolume: "Number of instances per workflow per month?",
        errorCost: "Avg. cost to fix a process error ($)?",
        projects: "Number of process improvement projects per year?",
        discoveryTime: "Avg. discovery time per project (hrs)?",
        failRate: "Project failure/rework rate due to poor analysis (%)?",
        failCost: "Avg. cost of a failed/reworked project ($)?",
    };

    // --- State Initialization ---
    function initializeState() {
        const type = automationTypeSelect.value;
        const module = moduleSelect.value;
        if (!state[type]) state[type] = {};
        if (!state[type][module]) {
            state[type][module] = {
                scorecard: {},
                qualification: { qualitative: {}, quantitative: {} },
                discovery: { qualitative: {}, quantitative: {}, custom: [] },
                roi: { inputs: {}, result: null }
            };
        }
    }

    // --- CONTENT LOADING & RENDERING ---
    function populateModules() {
        const type = automationTypeSelect.value;
        const currentModules = modules[type];
        moduleSelect.innerHTML = '';
        for (const key in currentModules) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = currentModules[key];
            moduleSelect.appendChild(option);
        }
        initializeState();
        loadContentForActiveTab();
    }
    
    function updateTabVisibility() {
        const role = roleSelect.value;
        const tabs = {
            Sales: [scorecardBtn, qualificationBtn, roiBtn],
            Presales: [qualificationBtn, discoveryBtn, roiBtn],
            'SDR/SAD': [qualificationBtn, discoveryBtn]
        };

        [scorecardBtn, qualificationBtn, discoveryBtn, roiBtn].forEach(btn => btn.style.display = 'none');
        if (tabs[role]) {
            tabs[role].forEach(btn => btn.style.display = 'inline-flex');
        }
        
        const activeTab = document.querySelector('.tab-button.active');
        if (!activeTab || activeTab.style.display === 'none') {
            const firstVisibleTab = document.querySelector('.tab-button[style*="inline-flex"]');
            if(firstVisibleTab) handleTabClick(firstVisibleTab);
        }
    }

    function loadContentForActiveTab() {
        const activeTabBtn = document.querySelector('.tab-button.active');
        if (!activeTabBtn) return;

        switch (activeTabBtn.id) {
            case 'scorecardBtn': loadScorecard(); break;
            case 'qualificationBtn': loadQualification(); break;
            case 'discoveryBtn': loadDiscoveryQuestions(); break;
            case 'roiBtn': loadRoiCalculator(); break;
        }
    }
    
    function loadScorecard() {
        let html = `<h2 class="text-2xl font-bold text-gray-800 mb-6">Opportunity Scorecard</h2>`;
        html += `<div class="bg-white p-6 rounded-lg shadow-md border space-y-6">`;
        scorecardQuestions.forEach(q => {
             html += `<div>
                        <p class="font-semibold text-gray-700 mb-2">${q.text}</p>
                        <div class="flex flex-wrap gap-x-6 gap-y-2" data-scorecard-question="${q.id}">
                            <label class="flex items-center"><input type="radio" name="${q.id}" value="20" class="form-radio text-blue-600 h-5 w-5 mr-2">Yes</label>
                            <label class="flex items-center"><input type="radio" name="${q.id}" value="0" class="form-radio text-blue-600 h-5 w-5 mr-2">No</label>
                            <label class="flex items-center"><input type="radio" name="${q.id}" value="0" class="form-radio text-blue-600 h-5 w-5 mr-2" checked>Unsure</label>
                        </div>
                     </div>`;
        });
        html += `</div>`;
        html += `<div id="scorecardResult" class="mt-6 p-6 bg-blue-100 rounded-lg text-center">
                    <p class="text-xl font-bold text-blue-800">Total Score: <span id="totalScore">0</span> / 100</p>
                 </div>`;
        scorecardSection.innerHTML = html;
        
        scorecardSection.querySelectorAll('[data-scorecard-question]').forEach(div => {
            div.addEventListener('change', calculateScorecard);
        });
    }
    
    function loadQualification() {
        let html = `<div id="qual-main-view">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold text-gray-800">Opportunity Qualification</h2>
                            <button data-action="show-qual-admin" class="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-3 rounded-lg">Admin Settings</button>
                        </div>`;

        const renderSection = (type) => {
            let sectionHtml = `<h3 class="text-xl font-semibold text-gray-700 mb-4 capitalize">${type} Assessment</h3>`;
            sectionHtml += `<div class="bg-white p-6 rounded-lg shadow-md border mb-8">`;
            qualificationQuestions[type].forEach(q => {
                sectionHtml += `<div class="mb-4">
                                <label class="block text-gray-800 font-semibold mb-2" for="${type}-${q.id}">${q.text}</label>
                                <select id="${type}-${q.id}" data-qual-type="${type}" class="w-full p-2 border border-gray-300 rounded-md">
                                    ${q.options.map(o => `<option value="${o.score}">${o.text}</option>`).join('')}
                                </select>
                             </div>`;
            });
            sectionHtml += `<button data-action="check-qual" data-type="${type}" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Check Status</button>
                          <div id="${type}Result" class="mt-4"></div>`;
            sectionHtml += `</div>`;
            return sectionHtml;
        }

        html += renderSection('qualitative');
        html += renderSection('quantitative');
        html += `</div>`;
        
        html += `<div id="qual-admin-view" class="hidden">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Qualification Admin Settings</h2>
                    <div class="bg-white p-6 rounded-lg shadow-md border space-y-4">
                        <div>
                            <label for="admin-qualified" class="block text-gray-700 font-semibold mb-1">'Qualified' Score Threshold (and above)</label>
                            <input type="number" id="admin-qualified" class="w-full p-2 border rounded-md" value="${state.qualAdmin.qualifiedThreshold}" placeholder="e.g., 8 (Number)">
                        </div>
                        <div>
                            <label for="admin-clarification" class="block text-gray-700 font-semibold mb-1">'Clarification Required' Score Threshold (and above)</label>
                             <input type="number" id="admin-clarification" class="w-full p-2 border rounded-md" value="${state.qualAdmin.clarificationThreshold}" placeholder="e.g., 5 (Number)">
                        </div>
                        <div class="flex gap-4 mt-4">
                            <button data-action="save-qual-admin" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save Settings</button>
                            <button data-action="restore-qual-defaults" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Restore Defaults</button>
                            <button data-action="show-qual-main" class="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Back to Qualification</button>
                        </div>
                    </div>
                </div>`;

        qualificationSection.innerHTML = html;
    }

    function loadDiscoveryQuestions() {
        const type = automationTypeSelect.value;
        const module = moduleSelect.value;
        const currentQuestions = questions[type]?.[module] || { qualitative: [], quantitative: [] };
        
        let html = `<h2 class="text-2xl font-bold text-gray-800 mb-6">Discovery Questions for ${modules[type][module]}</h2>`;

        const renderSection = (qType) => {
            const qList = currentQuestions[qType] || [];
            let sectionHtml = `<h3 class="text-xl font-semibold text-gray-700 mb-4 capitalize">${qType} Questions</h3>`;
            if (qList.length > 0) {
                 sectionHtml += qList.map((q, i) => `
                    <div class="mb-6 p-4 bg-white rounded-lg shadow-md border">
                        <label class="block text-gray-800 font-semibold mb-2" for="${qType}-q-${i}">${i + 1}. ${q}</label>
                        <textarea id="${qType}-q-${i}" rows="3" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter customer's answer (Text)..." data-discovery-q-type="${qType}" data-discovery-q-index="${i}"></textarea>
                    </div>`).join('');
            } else {
                 sectionHtml += `<p class="text-gray-500 mb-8">No ${qType} questions configured for this module.</p>`;
            }
            return sectionHtml;
        }

        html += renderSection('qualitative');
        html += renderSection('quantitative');
        html += `<h3 class="text-xl font-semibold text-gray-700 mb-4 mt-8">Custom Questions</h3>`;
        html += `<div id="customQuestionsContainer" class="space-y-4"></div>`;
        html += `<button id="addCustomQuestionBtn" data-action="add-custom-q" class="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Add Custom Question</button>`;
        discoverySection.innerHTML = html;
        renderCustomQuestions();
    }

    function renderCustomQuestions() {
        const container = document.getElementById('customQuestionsContainer');
        if (!container) return;

        const type = automationTypeSelect.value;
        const module = moduleSelect.value;
        const customQuestions = state[type]?.[module]?.discovery?.custom || [];

        container.innerHTML = customQuestions.map((cq) => `
            <div class="p-4 bg-white rounded-lg shadow-md border" data-custom-q-id="${cq.id}">
                <div class="flex justify-between items-center mb-2">
                     <input type="text" placeholder="Enter your question here (Text)..." value="${cq.question}" data-custom-q-input="question" class="w-full font-semibold text-gray-800 border-b-2 focus:border-blue-500 outline-none">
                     <button data-action="delete-custom-q" class="text-red-500 hover:text-red-700 ml-4 text-2xl font-bold">&times;</button>
                </div>
                <textarea rows="3" class="w-full p-2 border border-gray-300 rounded-md" data-custom-q-input="answer" placeholder="Enter answer here (Text)...">${cq.answer}</textarea>
            </div>
        `).join('');
    }

    function loadRoiCalculator() {
        const type = automationTypeSelect.value;
        const moduleKey = moduleSelect.value;
        const moduleName = modules[type][moduleKey];
        const moduleRoiConfig = roiQuestions[type]?.[moduleKey];

        let html = `<h2 class="text-2xl font-bold text-gray-800 mb-6">ROI Calculator for ${moduleName}</h2>`;
        if (!moduleRoiConfig) {
            roiSection.innerHTML = html + '<p class="text-center text-gray-600">ROI calculations are not configured for this module yet.</p>';
            return;
        }

        const roiInputs = moduleRoiConfig.formulas.reduce((acc, formula) => {
            Object.values(formula.inputs).forEach(id => acc[id] = true);
            return acc;
        }, {});

        let questionsHtml = Object.keys(roiInputs).map(id => `
             <div class="mb-4">
                <label for="${id}" class="block text-sm font-medium text-gray-700">${metricLabels[id] || `Metric: ${id}`}</label>
                <input type="number" id="${id}" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" placeholder="Enter a number...">
            </div>
        `).join('');

        html += `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div class="bg-white p-6 rounded-lg shadow-md border">
                         <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Business Metrics</h3>
                        ${questionsHtml}
                    </div>
                </div>
                <div>
                    <div class="bg-white p-6 rounded-lg shadow-md border mb-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Investment Costs</h3>
                         <div class="mb-4">
                            <label for="annualCost" class="block text-sm font-medium text-gray-700">Annual Software Cost ($)</label>
                            <input type="number" id="annualCost" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" placeholder="e.g., 30000 (Number)">
                        </div>
                        <div class="mb-4">
                            <label for="upfrontCost" class="block text-sm font-medium text-gray-700">Upfront Professional Services Cost ($)</label>
                            <input type="number" id="upfrontCost" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" placeholder="e.g., 20000 (Number)">
                        </div>
                        <div class="mb-4">
                            <label for="contractYears" class="block text-sm font-medium text-gray-700">Contract Length (Years)</label>
                            <input type="number" id="contractYears" value="3" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" placeholder="e.g., 3 (Number)">
                        </div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <button data-action="calculate-roi" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg">Calculate ROI</button>
                        <button data-action="demo-data" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg">Populate with Demo Data</button>
                    </div>
                </div>
            </div>
            <div id="roiResult" class="mt-8"></div>`;
        roiSection.innerHTML = html;
    }

    // --- CALCULATION & ACTION FUNCTIONS ---
    function calculateScorecard() {
        let totalScore = 0;
        scorecardQuestions.forEach(q => {
             const selectedValue = scorecardSection.querySelector(`input[name="${q.id}"]:checked`);
             if(selectedValue) totalScore += parseInt(selectedValue.value);
        });
        scorecardSection.querySelector('#totalScore').textContent = totalScore;
    }

    function checkQualification(type) {
        let score = 0;
        const questions = qualificationQuestions[type];
        const inputs = qualificationSection.querySelectorAll(`[data-qual-type="${type}"]`);
        
        inputs.forEach(input => score += parseInt(input.value));

        let resultHtml;
        let resultDiv = qualificationSection.querySelector(`#${type}Result`);
        
        const { qualifiedThreshold, clarificationThreshold } = state.qualAdmin;
        const maxScore = questions.length * 3;


        if (score >= qualifiedThreshold) {
            resultHtml = `<div class="p-4 rounded-lg bg-green-100 text-green-800"><h3 class="font-bold">Qualified</h3><p>Opportunity shows strong signs of being a good fit based on ${type} criteria. (${score}/${maxScore})</p></div>`;
        } else if (score >= clarificationThreshold) {
             resultHtml = `<div class="p-4 rounded-lg bg-yellow-100 text-yellow-800"><h3 class="font-bold">Clarification Required</h3><p>Potential exists, but further discovery is needed on ${type} points. (${score}/${maxScore})</p></div>`;
        } else {
             resultHtml = `<div class="p-4 rounded-lg bg-red-100 text-red-800"><h3 class="font-bold">Not Suitable</h3><p>Opportunity may not be a good fit at this time based on ${type} criteria. (${score}/${maxScore})</p></div>`;
        }
        resultDiv.innerHTML = resultHtml;
    }
    
    function populateDemoData() {
        const type = automationTypeSelect.value;
        const module = moduleSelect.value;
        const demoData = roiQuestions[type]?.[module]?.demoData;
        if (demoData) {
            for (const id in demoData) {
                const input = roiSection.querySelector(`#${id}`);
                if (input) input.value = demoData[id];
            }
            roiSection.querySelector('#annualCost').value = 30000;
            roiSection.querySelector('#upfrontCost').value = 20000;
            calculateRoi();
        } else {
            alert('No demo data available for this module.');
        }
    }

    function calculateRoi() {
        const type = automationTypeSelect.value;
        const module = moduleSelect.value;
        const moduleRoiConfig = roiQuestions[type]?.[module];

        if (!moduleRoiConfig) return;

        const g = (id) => parseFloat(roiSection.querySelector(`#${id}`)?.value) || 0;
        const annualCost = g('annualCost');
        const upfrontCost = g('upfrontCost');
        const contractYears = g('contractYears') || 3;

        let totalAnnualSavings = 0;
        let detailedWorkings = '';

        const inputs = {};
        moduleRoiConfig.formulas.forEach(f => {
            Object.values(f.inputs).forEach(inputId => {
                inputs[inputId] = g(inputId);
            });
        });

        moduleRoiConfig.formulas.forEach(f => {
            const savings = f.formula(inputs);
            totalAnnualSavings += savings;
            detailedWorkings += `<div class="p-3 bg-gray-100 rounded-md">
                                    <p class="font-semibold text-gray-700">${f.name}:</p>
                                    <p class="text-sm text-gray-500 italic">${f.description(inputs)}</p>
                                    <p class="text-right font-bold text-green-600">$${savings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                </div>`;
        });
        
        const netAnnualBenefit = totalAnnualSavings - annualCost;
        let cumulativeInvestment = 0;
        let cumulativeBenefit = 0;
        let breakdownHtml = '';
        
        for (let i = 1; i <= contractYears; i++) {
            const yearInvestment = (i === 1 ? upfrontCost : 0) + annualCost;
            cumulativeInvestment += yearInvestment;
            cumulativeBenefit += totalAnnualSavings;
            const cumulativeNet = cumulativeBenefit - cumulativeInvestment;
            const cumulativeRoi = cumulativeInvestment > 0 ? (cumulativeNet / cumulativeInvestment) * 100 : 0;
            
             breakdownHtml += `<tr class="border-b">
                <td class="px-4 py-3 font-medium">${i}</td>
                <td class="px-4 py-3">$${yearInvestment.toLocaleString()}</td>
                <td class="px-4 py-3">$${totalAnnualSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="px-4 py-3 ${cumulativeNet >= 0 ? 'text-green-600' : 'text-red-600'} font-semibold">$${cumulativeNet.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td class="px-4 py-3 font-bold ${cumulativeRoi >= 0 ? 'text-blue-600' : 'text-red-600'}">${cumulativeRoi.toFixed(1)}%</td>
            </tr>`;
        }
        
        const totalInvestment = upfrontCost + (annualCost * contractYears);
        const totalBenefit = totalAnnualSavings * contractYears;
        const totalNet = totalBenefit - totalInvestment;
        const totalRoi = totalInvestment > 0 ? (totalNet / totalInvestment) * 100 : 0;
         let paybackPeriodText = '';
         if (netAnnualBenefit > 0) {
             const paybackMonths = (upfrontCost / netAnnualBenefit) * 12;
             paybackPeriodText = paybackMonths > 0 ? `${paybackMonths.toFixed(1)} months` : 'Immediate';
         } else {
             paybackPeriodText = 'N/A';
         }
        
        state[type][module].roi.result = {
            totalAnnualSavings: totalAnnualSavings.toFixed(2),
            annualSoftwareCost: annualCost.toFixed(2),
            upfrontServicesCost: upfrontCost.toFixed(2),
            contractLength: contractYears,
            netAnnualBenefit: netAnnualBenefit.toFixed(2),
            totalInvestment: totalInvestment.toFixed(2),
            totalBenefit: totalBenefit.toFixed(2),
            netBenefit: totalNet.toFixed(2),
            roiPercentage: totalRoi.toFixed(1),
            paybackPeriod: paybackPeriodText,
            workings: detailedWorkings,
            breakdown: breakdownHtml
        };

        const resultHtml = `
        <div class="space-y-8 mt-8">
            <div class="bg-white p-6 rounded-lg shadow-md border grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div><p class="text-sm text-gray-500">Total Savings (${contractYears}yr)</p><p class="text-2xl font-bold text-green-600">$${totalBenefit.toLocaleString(undefined, {minimumFractionDigits: 2})}</p></div>
                <div><p class="text-sm text-gray-500">Total Investment (${contractYears}yr)</p><p class="text-2xl font-bold text-red-600">$${totalInvestment.toLocaleString()}</p></div>
                <div><p class="text-sm text-gray-500">Overall ROI</p><p class="text-2xl font-bold text-custom-blue">${totalRoi.toFixed(1)}%</p></div>
                <div><p class="text-sm text-gray-500">Payback Period</p><p class="text-2xl font-bold text-custom-blue">${paybackPeriodText}</p></div>
            </div>
             <div class="bg-white p-6 rounded-lg shadow-md border">
                <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Savings Calculation Workings (Annual)</h3>
                <div class="space-y-4">${detailedWorkings}</div>
                 <div class="mt-4 pt-4 border-t font-bold text-lg text-right">Total Annual Savings: $${totalAnnualSavings.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border">
                 <h3 class="text-xl font-semibold text-gray-800 mb-4 border-b pb-3">Annual Breakdown</h3>
                 <div class="overflow-x-auto">
                    <table class="w-full text-left">
                       <thead class="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th class="px-4 py-3">Year</th><th class="px-4 py-3">Annual Investment</th><th class="px-4 py-3">Annual Savings</th><th class="px-4 py-3">Cumulative Net</th><th class="px-4 py-3">Cumulative ROI</th>
                            </tr>
                       </thead>
                       <tbody class="divide-y">${breakdownHtml}</tbody>
                    </table>
                 </div>
            </div>
        </div>`;
        roiSection.querySelector('#roiResult').innerHTML = resultHtml;
    }

    function clearForm() {
        const adminSettings = { ...state.qualAdmin };
        state = { qualAdmin: adminSettings };
        
        initializeState();
        loadContentForActiveTab();
    }

    function captureAndExportData() {
        const type = automationTypeSelect.value;
        const module = moduleSelect.value;
        if (!state[type] || !state[type][module]) {
            initializeState();
        }
        const moduleState = state[type][module];
        
        // Scorecard
        if(scorecardSection.querySelector('[data-scorecard-question]')){
            scorecardQuestions.forEach(q => {
                const selected = scorecardSection.querySelector(`input[name="${q.id}"]:checked`);
                if (selected) {
                    moduleState.scorecard[q.id] = { text: q.text, answer: selected.parentElement.textContent.trim(), score: selected.value };
                }
            });
        }
       
        // Qualification
        if(qualificationSection.querySelector('[data-qual-type]')){
            ['qualitative', 'quantitative'].forEach(qType => {
                qualificationQuestions[qType].forEach(q => {
                    const select = qualificationSection.querySelector(`#${qType}-${q.id}`);
                    if (select) {
                        moduleState.qualification[qType][q.id] = {
                            text: q.text,
                            answer: select.options[select.selectedIndex].text,
                            score: select.value
                        };
                    }
                });
            });
        }
        
        // Discovery
        if(discoverySection.querySelector('[data-discovery-q-type]')){
            ['qualitative', 'quantitative'].forEach(qType => {
                 const qList = questions[type]?.[module]?.[qType] || [];
                 moduleState.discovery[qType] = [];
                 qList.forEach((qText, i) => {
                     const textarea = discoverySection.querySelector(`#${qType}-q-${i}`);
                     if(textarea) moduleState.discovery[qType][i] = { question: qText, answer: textarea.value };
                 });
            });
            
            const customQContainers = discoverySection.querySelectorAll('[data-custom-q-id]');
            if (customQContainers) {
                moduleState.discovery.custom = Array.from(customQContainers).map(c => ({
                    id: c.dataset.customQId,
                    question: c.querySelector('[data-custom-q-input="question"]').value,
                    answer: c.querySelector('[data-custom-q-input="answer"]').value
                }));
            }
        }
        
        const roiConfig = roiQuestions[type]?.[module];
        if (roiConfig && roiSection.querySelector('#roiResult')) {
             const roiInputsConfig = roiConfig.formulas.reduce((acc, formula) => {
                Object.values(formula.inputs).forEach(id => acc[id] = true);
                return acc;
             }, {});
             moduleState.roi.inputs = {};
             Object.keys(roiInputsConfig).forEach(id => {
                const input = roiSection.querySelector(`#${id}`);
                if (input) moduleState.roi.inputs[id] = input.value;
             });
             moduleState.roi.inputs.annualCost = roiSection.querySelector('#annualCost')?.value;
             moduleState.roi.inputs.upfrontCost = roiSection.querySelector('#upfrontCost')?.value;
             moduleState.roi.inputs.contractYears = roiSection.querySelector('#contractYears')?.value;
        }

        const format = document.querySelector('input[name="export-format"]:checked').value;
        generateExport(format);
    }
    
    function generateExport(format) {
        const role = roleSelect.value;
        const type = automationTypeSelect.value;
        const module = moduleSelect.value;
        const moduleState = state[type]?.[module] || {};
        const moduleName = modules[type][module];

        let content = '';
        let mimeType, extension;

        const sections = {
            scorecard: () => {
                let s = 'Opportunity Scorecard\n---------------------\n';
                if(!moduleState.scorecard || Object.keys(moduleState.scorecard).length === 0) return s + "Not completed.\n\n";
                for (const q of scorecardQuestions) {
                    const data = moduleState.scorecard?.[q.id];
                    if (data) s += `${data.text}\nAnswer: ${data.answer || 'Not given'}\n\n`;
                }
                const totalScore = Object.values(moduleState.scorecard || {}).reduce((acc, cur) => acc + parseInt(cur.score), 0);
                s += `Total Score: ${totalScore} / 100\n\n`;
                return s;
            },
            qualification: () => {
                 let s = 'Qualification\n-------------\n';
                 let completed = false;
                ['qualitative', 'quantitative'].forEach(qType => {
                     s += `\n${qType.charAt(0).toUpperCase() + qType.slice(1)} Assessment:\n`;
                     if(!moduleState.qualification || !moduleState.qualification[qType] || Object.keys(moduleState.qualification[qType]).length === 0){
                         s += "Not completed.\n\n";
                         return;
                     }
                     for (const q of qualificationQuestions[qType]) {
                        const data = moduleState.qualification?.[qType]?.[q.id];
                        if (data && data.answer !== 'Select...') {
                            s += `${data.text}\nAnswer: ${data.answer || 'Not given'}\n\n`;
                            completed = true;
                        }
                     }
                });
                if(!completed) return 'Qualification\n-------------\nNot completed.\n\n';
                return s;
            },
            discovery: () => {
                let s = 'Discovery Questions\n-------------------\n';
                let completed = false;
                 ['qualitative', 'quantitative'].forEach(qType => {
                     s += `\n${qType.charAt(0).toUpperCase() + qType.slice(1)} Questions:\n`;
                     const qList = moduleState.discovery?.[qType] || [];
                     if(qList.length === 0){
                         s += "No data entered.\n";
                     } else {
                        qList.forEach(item => {
                            s += `Q: ${item.question}\nA: ${item.answer || 'Not answered'}\n\n`;
                            if (item.answer) completed = true;
                        });
                     }
                 });
                 if (moduleState.discovery?.custom?.length > 0) {
                     s += `\nCustom Questions:\n`;
                     moduleState.discovery.custom.forEach(item => {
                        s += `Q: ${item.question || 'Custom Question'}\nA: ${item.answer || 'Not answered'}\n\n`;
                        if (item.question || item.answer) completed = true;
                     });
                 }
                if(!completed) return 'Discovery Questions\n-------------------\nNot completed.\n\n';
                return s;
            },
            roi: () => {
                let s = 'ROI Calculator\n--------------\n';
                if (!moduleState.roi?.result) return s + 'ROI not calculated.\n\n';

                const inputs = moduleState.roi.inputs || {};
                const result = moduleState.roi.result;

                s += 'Investment Inputs:\n';
                s += `- Annual Software Cost: $${inputs.annualCost || 'N/A'}\n`;
                s += `- Upfront Services Cost: $${inputs.upfrontCost || 'N/A'}\n`;
                s += `- Contract Length: ${inputs.contractYears || 'N/A'} years\n\n`;
                s += 'Business Metric Inputs:\n';
                
                const roiConfig = roiQuestions[type]?.[module];
                if (roiConfig) {
                    const roiInputsConfig = roiConfig.formulas.reduce((acc, formula) => {
                        Object.values(formula.inputs).forEach(id => acc[id] = true);
                        return acc;
                    }, {});
                    Object.keys(roiInputsConfig).forEach(id => {
                        s += `- ${metricLabels[id] || id}: ${inputs[id] || 'N/A'}\n`;
                    });
                }
                
                s += '\nROI Summary:\n';
                s += `- Overall ROI (${result.contractLength} years): ${result.roiPercentage}%\n`;
                s += `- Payback Period: ${result.paybackPeriod}\n`;
                s += `- Total Benefit: $${result.totalBenefit}\n`;
                s += `- Total Investment: $${result.totalInvestment}\n\n`;
                
                return s;
            }
        };
        
        const roleSections = {
            Sales: ['scorecard', 'qualification', 'roi'],
            Presales: ['qualification', 'discovery', 'roi'],
            'SDR/SAD': ['qualification', 'discovery']
        };
        
        let header = `Discovery & ROI Report\nRole: ${role}\nModule: ${moduleName}\n\n`;

        roleSections[role].forEach(sectionKey => {
            content += sections[sectionKey]();
        });

        if (format === 'md') {
            content = header.replace(/\n/g, '\n\n').replace(/---/g, '---') + content.replace(/\n/g, '\n\n').replace(/---/g, '---');
            mimeType = 'text/markdown';
            extension = 'md';
        } else if (format === 'ai') {
            const aiPrompt = `You are an expert business analyst providing concise and actionable insights on process improvement and technology adoption. Your task is to analyse the provided discovery information and ROI data for a client interested in optimising their ${moduleName} process.

Based on the detailed information below, please provide:
1.  **A concise summary of the key challenges and opportunities identified from the discovery answers.** Focus on the most critical pain points.
2.  **A summary of the key financial benefits and investments based on the ROI output.** Highlight the most significant savings and the overall net benefit/ROI percentage.
3.  **Strategic recommendations for process improvement and technology adoption.** Specifically, describe how a suitable digital solution can address the identified challenges and achieve the calculated benefits within the ${moduleName} process.
    **Important:** Do not use brand names in your response. Frame recommendations generally (e.g., 'an automation platform', 'a digital solution', 'a cloud-based system').
4.  **Ensure all spelling in your response aligns with Australian English (e.g., analyse, organisation).**
5.  **If you cannot provide a recommendation or summary for a specific section due to missing information, please explicitly state 'Insufficient data was provided to generate a response for this section.' Do not make up information.**

---
### CLIENT DATA:
${header}${content}
---

Please provide your analysis and recommendations now.`;
            content = aiPrompt;
            mimeType = 'text/plain';
            extension = 'txt';
        } else { // txt
            content = header + content;
            mimeType = 'text/plain';
            extension = 'txt';
        }
        
        const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${module.replace(/\s/g, '_')}_Report.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        exportSuccessMessage.classList.remove('hidden');
        setTimeout(() => exportSuccessMessage.classList.add('hidden'), 3000);
    }
    
    
    function handleContentAreaClick(e) {
        const action = e.target.dataset.action;
        if (!action) return;

        if (action === 'check-qual') {
            checkQualification(e.target.dataset.type);
        } else if (action === 'calculate-roi') {
            calculateRoi();
        } else if (action === 'demo-data') {
            populateDemoData();
        } else if (action === 'add-custom-q') {
            const type = automationTypeSelect.value;
            const module = moduleSelect.value;
            if (!state[type][module].discovery.custom) {
                 state[type][module].discovery.custom = [];
            }
            state[type][module].discovery.custom.push({ id: Date.now(), question: '', answer: '' });
            renderCustomQuestions();
        } else if (action === 'delete-custom-q') {
            const type = automationTypeSelect.value;
            const module = moduleSelect.value;
            const questionId = e.target.closest('[data-custom-q-id]').dataset.customQId;
            state[type][module].discovery.custom = state[type][module].discovery.custom.filter(q => q.id != questionId);
            renderCustomQuestions();
        } else if (action === 'show-qual-admin') {
            qualificationSection.querySelector('#qual-main-view').classList.add('hidden');
            qualificationSection.querySelector('#qual-admin-view').classList.remove('hidden');
        } else if (action === 'show-qual-main') {
            qualificationSection.querySelector('#qual-main-view').classList.remove('hidden');
            qualificationSection.querySelector('#qual-admin-view').classList.add('hidden');
        } else if (action === 'save-qual-admin') {
            state.qualAdmin.qualifiedThreshold = parseInt(qualificationSection.querySelector('#admin-qualified').value) || state.qualAdmin.defaults.qualifiedThreshold;
            state.qualAdmin.clarificationThreshold = parseInt(qualificationSection.querySelector('#admin-clarification').value) || state.qualAdmin.defaults.clarificationThreshold;
            alert('Qualification settings saved!');
        } else if (action === 'restore-qual-defaults') {
            state.qualAdmin.qualifiedThreshold = state.qualAdmin.defaults.qualifiedThreshold;
            state.qualAdmin.clarificationThreshold = state.qualAdmin.defaults.clarificationThreshold;
            qualificationSection.querySelector('#admin-qualified').value = state.qualAdmin.qualifiedThreshold;
            qualificationSection.querySelector('#admin-clarification').value = state.qualAdmin.clarificationThreshold;
            alert('Default settings restored!');
        }
    }

    // --- Event Listeners ---
    automationTypeSelect.addEventListener('change', populateModules);
    roleSelect.addEventListener('change', updateTabVisibility);
    moduleSelect.addEventListener('change', () => {
        initializeState();
        loadContentForActiveTab();
    });
    
    function handleTabClick(activeBtn) {
        [scorecardBtn, qualificationBtn, discoveryBtn, roiBtn].forEach(btn => btn.classList.remove('active'));
        [scorecardSection, qualificationSection, discoverySection, roiSection].forEach(sec => sec.classList.add('hidden'));
        
        activeBtn.classList.add('active');
        let activeSection;
        if (activeBtn === scorecardBtn) activeSection = scorecardSection;
        else if (activeBtn === qualificationBtn) activeSection = qualificationSection;
        else if (activeBtn === discoveryBtn) activeSection = discoverySection;
        else activeSection = roiSection;
        
        activeSection.classList.remove('hidden');
        loadContentForActiveTab();
    }

    [scorecardBtn, qualificationBtn, discoveryBtn, roiBtn].forEach(btn => {
        btn.addEventListener('click', () => handleTabClick(btn));
    });
    
    contentArea.addEventListener('click', handleContentAreaClick);
    
    exportBtn.addEventListener('click', captureAndExportData);
    clearFormBtn.addEventListener('click', clearForm);

    // --- Initial Load ---
    function initialize() {
        populateModules();
        updateTabVisibility();
        const firstVisibleTab = document.querySelector('.tab-button[style*="inline-flex"]');
        if (firstVisibleTab) {
            handleTabClick(firstVisibleTab);
        } else {
             handleTabClick(qualificationBtn); // Default fallback
        }
    }
    
    initialize();
});
