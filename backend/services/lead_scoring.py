
import math


def calculate_lead_score(lead):
    """
    Deterministic lead qualification engine for SolarFlow.
    """

    # Use actual monthly units when available.
    # Otherwise, use a demo assumption of Rs. 8 per unit.
    if lead.avg_units is not None:
        monthly_units = lead.avg_units
        units_source = "Provided by customer"
    else:
        monthly_units = lead.monthly_bill / 8
        units_source = "Estimated using Rs. 8 per unit"

    score = 0
    reasons = []

    ownership = lead.ownership.strip().lower()

    # 1. Ownership assessment
    if ownership == "owner":
        score += 30
        reasons.append("Customer owns the property")
    else:
        reasons.append(
            "Tenant: property-owner permission needs to be checked"
        )

    # 2. Electricity consumption
    if monthly_units >= 300:
        score += 40
        reasons.append("High electricity consumption")
    elif monthly_units >= 200:
        score += 30
        reasons.append("Moderate electricity consumption")
    elif monthly_units >= 100:
        score += 15
        reasons.append("Low electricity consumption")
    else:
        score += 5
        reasons.append("Very low electricity consumption")

    # 3. Roof area suitability
    if lead.roof_area >= 300:
        score += 20
        reasons.append("Good roof area")
    elif lead.roof_area >= 200:
        score += 15
        reasons.append("Moderate roof area")
    elif lead.roof_area >= 100:
        score += 10
        reasons.append("Limited roof area")
    else:
        reasons.append("Insufficient roof area")

    # 4. Monthly electricity bill
    if lead.monthly_bill >= 2500:
        score += 10
        reasons.append("High monthly electricity bill")
    elif lead.monthly_bill >= 1500:
        score += 7
        reasons.append("Moderate monthly electricity bill")
    else:
        score += 3
        reasons.append("Small monthly electricity bill")

    # 5. Determine recommended solar capacity.
    required_kw = math.ceil(
        (monthly_units * 12) / 1400
    )

    available_kw = math.floor(
        lead.roof_area / 100
    )

    recommended_kw = min(required_kw, available_kw)

    if recommended_kw < 1:
        recommended_kw = None

    # 6. Assign priority.
    # Tenants and very small consumers should not be rejected.
    if (
        ownership != "owner"
        or monthly_units < 100
        or lead.monthly_bill < 1000
        or recommended_kw is None
    ):
        priority = "Low"

    elif score >= 70:
        priority = "High"

    elif score >= 45:
        priority = "Medium"

    else:
        priority = "Low"

    # 7. Recommend the next sales action.
    if ownership != "owner":
        next_action = (
            "Schedule a short call to check property-owner permission"
        )
    elif priority == "High":
        next_action = "Prioritize site survey scheduling"
    elif priority == "Medium":
        next_action = "Contact customer and verify roof suitability"
    else:
        next_action = "Conduct a short qualification call"

    return {
        "score": score,
        "priority": priority,
        "monthly_units": round(monthly_units, 2),
        "units_source": units_source,
        "recommended_kw": recommended_kw,
        "reasons": reasons,
        "next_action": next_action
    }
