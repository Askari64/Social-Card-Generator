import { LegalShell, H, P } from "@/components/Legal";

export const metadata = { title: "Terms of Use - Card Studio" };

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Use" updated="October 8, 2026">
      <P>
        Card Studio is a free personal project by Askari Rizvi. By using it, you agree to these terms.
      </P>

      <H>The service</H>
      <P>
        Card Studio lets you design a social card with your contact details and a vCard QR code, and export it
        as a PNG, a printout, or a .vcf file. The app runs entirely in your browser and is provided free of charge.
      </P>

      <H>Provided as is</H>
      <P>
        The app is provided "as is", without warranties of any kind. While the vCard QR codes follow the vCard 3.0
        standard, you should scan and check your own card before printing or sharing it widely. The project is not
        liable for any loss arising from use of the app, misprinted cards, or details you chose to include.
      </P>

      <H>Your responsibilities</H>
      <P>
        Only put information on a card that you have the right to share, and only share cards with people you want
        to have that information. Do not use the app to create cards that impersonate someone else, misrepresent
        your identity, or are intended to deceive.
      </P>

      <H>Your content</H>
      <P>
        The details and photo you put on your card remain yours. The app claims no rights over them - they never
        leave your device (see the Privacy Policy). The card templates and the app's design are part of the project.
      </P>

      <H>Changes</H>
      <P>
        These terms may be updated from time to time; the effective date above shows the current version.
        Continued use after an update means you accept the new terms.
      </P>

      <H>Contact</H>
      <P>
        Questions about these terms: reach Askari Rizvi through the channel you got this app from.
      </P>
    </LegalShell>
  );
}
