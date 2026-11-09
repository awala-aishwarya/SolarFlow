
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from pathlib import Path


def generate_quotation_pdf(customer_name, lead_id, quotation):

    output_dir = Path(__file__).resolve().parent.parent / "quotes"
    output_dir.mkdir(parents=True, exist_ok=True)

    file_path = output_dir / f"{lead_id}_quotation.pdf"

    document = SimpleDocTemplate(
        str(file_path),
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm
    )

    styles = getSampleStyleSheet()
    elements = []

    elements.append(
        Paragraph("<b>SOLARFLOW</b>", styles["Title"])
    )

    elements.append(
        Paragraph("Solar Installation Quotation", styles["Heading2"])
    )

    elements.append(Spacer(1, 15))

    elements.append(
        Paragraph(f"<b>Customer:</b> {customer_name}", styles["Normal"])
    )

    elements.append(
        Paragraph(f"<b>Lead ID:</b> {lead_id}", styles["Normal"])
    )

    elements.append(Spacer(1, 20))

    table_data = [
        ["Description", "Estimated Value"],
        ["Solar System Capacity", f'{quotation["system_capacity_kw"]} kW'],
        ["Annual Generation", f'{quotation["annual_generation_units"]} units'],
        ["Installation Cost", f'Rs. {quotation["installation_cost"]:,.2f}'],
        ["Estimated Subsidy", f'Rs. {quotation["estimated_subsidy"]:,.2f}'],
        ["Net Installation Cost", f'Rs. {quotation["net_installation_cost"]:,.2f}'],
        ["Estimated Annual Savings", f'Rs. {quotation["estimated_annual_savings"]:,.2f}'],
        ["Estimated Payback", f'{quotation["estimated_payback_years"]} years']
    ]

    table = Table(table_data, colWidths=[85 * mm, 75 * mm])

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 10),
        ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold")
    ]))

    elements.append(table)
    elements.append(Spacer(1, 20))

    elements.append(
        Paragraph(
            "Note: This is an illustrative quotation based on demo "
            "pricing and subsidy assumptions. Actual costs, subsidy "
            "eligibility, savings and payback must be verified.",
            styles["Italic"]
        )
    )

    document.build(elements)

    return str(file_path)
