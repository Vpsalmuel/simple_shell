// Photos generated for Rex Hub (Figma AI, REX INSURANCE team). Replace with real company photography when available.
import newsTelematics from '../assets/photos/news-telematics.jpg'
import newsClaimsTeam from '../assets/photos/news-claims-team.jpg'
import newsCustomerCare from '../assets/photos/news-customer-care.jpg'
import newsSso from '../assets/photos/news-sso.jpg'
import newsTownHall from '../assets/photos/news-town-hall.jpg'
import newsHealthPlan from '../assets/photos/news-health-plan.jpg'
import courseAml from '../assets/photos/course-aml.jpg'
import courseNdpa from '../assets/photos/course-ndpa.jpg'
import courseCyber from '../assets/photos/course-cyber.jpg'
import courseClaims from '../assets/photos/course-claims.jpg'
import courseUnderwriting from '../assets/photos/course-underwriting.jpg'
import courseIfrs17 from '../assets/photos/course-ifrs17.jpg'
import courseCx from '../assets/photos/course-cx.jpg'
import courseExcel from '../assets/photos/course-excel.jpg'
import courseManager from '../assets/photos/course-manager.jpg'
import courseFeedback from '../assets/photos/course-feedback.jpg'

// Keyed by news id.
export const newsPhotos = { 1: newsTelematics, 2: newsClaimsTeam, 3: newsCustomerCare, 4: newsSso, 5: newsTownHall, 6: newsHealthPlan }

// Keyed by course id.
export const coursePhotos = {
  aml: courseAml, ndpa: courseNdpa, cyber: courseCyber, claims101: courseClaims, uw: courseUnderwriting,
  ifrs17: courseIfrs17, cx: courseCx, excel: courseExcel, lead: courseManager, feedback: courseFeedback,
}

import wbHmo from '../assets/photos/wellbeing-hmo.jpg'
import wbMind from '../assets/photos/wellbeing-mind.jpg'
import wbFitness from '../assets/photos/wellbeing-fitness.jpg'
import wbHike from '../assets/photos/wellbeing-hike.jpg'
import deskBrand from '../assets/photos/desk-brand.jpg'
import deskIt from '../assets/photos/desk-it.jpg'
import deskAdmin from '../assets/photos/desk-admin.jpg'
import deskHr from '../assets/photos/desk-hr.jpg'

export const wellbeingPhotos = { hmo: wbHmo, mind: wbMind, fitness: wbFitness, hike: wbHike }
export const deskPhotos = { 'Brand & Communications': deskBrand, IT: deskIt, Admin: deskAdmin, HR: deskHr }

// Department cards reuse the closest matching photo until each team supplies its own.
export const departmentPhotos = {
  claims: newsClaimsTeam, underwriting: courseUnderwriting, care: newsCustomerCare, actuarial: courseExcel, finance: courseIfrs17,
  hr: deskHr, it: deskIt, comms: deskBrand, compliance: courseAml,
}

import dressOffice from '../assets/photos/dress-office.jpg'
import dressClient from '../assets/photos/dress-client.jpg'
import dressRemote from '../assets/photos/dress-remote.jpg'
import dressFriday from '../assets/photos/dress-friday.jpg'

export const dressPhotos = { office: dressOffice, client: dressClient, remote: dressRemote, friday: dressFriday }
