import { LegalShell, H, P } from "@/components/Legal";

export const metadata = { title: "Privacy Policy - Card Studio" };

// Every claim below matches the implementation: no backend, no analytics,
// no third-party calls at runtime; profile data lives in localStorage.
export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="October 8, 2026">
      <P>
        Card Studio is a personal project by Askari Rizvi. It is built to be private by design:
        the app runs entirely in your browser, and the details you put on your card never leave your device.
      </P>

      <H>What the app asks for</H>
      <P>
        Your name, role, company, phone number, email, website, social handles, and an optional photo.
        You can enter as much or as little as you like - every field is optional.
      </P>

      <H>Where that information goes</H>
      <P>
        Nowhere. Everything you type is saved in your browser's localStorage on your own device so your
        card is still there when you come back. There is no account, no server, no database, no analytics,
        no tracking, and no advertising. The project has no backend of any kind - there is literally
        nowhere for your information to be sent.
      </P>
      <P>
        Your photo, if you add one, is downscaled in your browser and stored the same way: on your device only.
      </P>

      <H>The QR code and exports</H>
      <P>
        The QR code on your card is a vCard - it contains the contact details you entered, encoded so a phone
        camera can offer "add to contacts". The QR is generated entirely in your browser. The same is true of
        the PNG download, the print output, and the .vcf file: they are produced locally, on your device.
      </P>
      <P>
        Once you share a card, a printed copy, a PNG, or a .vcf with someone, they have the details you put on it -
        that is the purpose of the app. Share it only with people you want to have your contact information.
      </P>

      <H>Third parties</H>
      <P>
        None. The app makes no third-party requests while you use it. Fonts are bundled with the app at build
        time, QR codes are generated locally, and no external service ever sees your details.
      </P>

      <H>Deleting your information</H>
      <P>
        Use the "Clear all" button in the editor, or clear your browser's site data for this site.
        Both remove everything the app stored.
      </P>

      <H>Changes</H>
      <P>
        If this policy changes, the effective date above will be updated. The privacy model - everything stays
        on your device - is the core design of the app and will not change.
      </P>

      <H>Contact</H>
      <P>
        Questions about this policy: reach Askari Rizvi through the channel you got this app from.
      </P>
    </LegalShell>
  );
}
