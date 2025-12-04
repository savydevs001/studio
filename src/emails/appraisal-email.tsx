// This file is no longer used by the application but is kept for future reference.
// The email sending logic has been temporarily removed to resolve build issues.

interface AppraisalEmailProps {
  data: { [key: string]: any };
}

const toTitleCase = (str: string) => {
  if (!str) return '';
  const spaced = str.replace(/([A-Z])/g, ' $1');
  const cleaned = spaced.replace(/^(photo|Photo)/, '').trim();
  return cleaned.replace(/^./, (s) => s.toUpperCase());
};

const DataRow = ({ label, value }: { label: string; value: string | undefined }) => `
  <tr style="border-bottom: 1px solid #eaeaea;">
    <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">${label}:</td>
    <td style="padding: 8px 0; color: #000; text-align: right; font-size: 14px; vertical-align: top;">${value || 'Not Provided'}</td>
  </tr>
`;

const DescriptionRow = ({ label, value }: { label: string; value: string | undefined }) => {
  if (!value || !value.trim()) return '';
  return `
    <div style="margin-top: 4px; padding: 8px; background-color: #f9f9f9; border-radius: 4px;">
      <p style="margin: 0; color: #666; font-size: 14px;">${label}:</p>
      <p style="margin: 4px 0 0; color: #000; font-size: 14px;">${value}</p>
    </div>
  `;
}

export function AppraisalEmailHtml({ data }: AppraisalEmailProps): string {
  const vehicleTitle = `${data.year} ${data.make} ${data.model}`;

  const vehicleInfo = [
    { label: 'VIN', value: data.vin },
    { label: 'Odometer', value: data.odometer },
    { label: 'Trim', value: data.trim },
    { label: 'Transmission', value: data.transmission },
    { label: 'Drivetrain', value: data.drivetrain },
  ];

  const contactInfo = [
    { label: 'Name', value: data.name },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
  ];

  const conditionInfo = [
      { label: 'Accident History', value: data.accidentHistory, details: data.accidentDetails },
      { label: 'Frame Damage', value: data.frameDamage, details: data.frameDamageDetails },
      { label: 'Flood Damage', value: data.floodDamage, details: data.floodDamageDetails },
      { label: 'Smoked In', value: data.smokedIn, details: data.smokedInDetails },
      { label: 'Mechanical Issues', value: data.mechanicalIssues, details: data.mechanicalIssuesDetails },
      { label: 'Odometer Broken/Replaced', value: data.odometerBroken, details: data.odometerBrokenDetails },
      { label: 'Paint/Body Work Needed', value: data.paintBodyWork, details: data.paintBodyWorkDetails },
      { label: 'Rust/Hail Damage', value: data.rustHailDamage, details: data.rustHailDamageDetails },
      { label: 'Interior Parts Broken', value: data.interiorBroken, details: data.interiorBrokenDetails },
      { label: 'Interior Rips/Tears/Stains', value: data.interiorRips, details: data.interiorRipsDetails },
      { label: 'Tires Need Replacement', value: data.tiresNeedReplacement, details: data.tiresNeedReplacementDetails },
      { label: 'Number of Keys', value: data.keys },
      { label: 'Aftermarket Modifications', value: data.aftermarketModifications, details: data.aftermarketModificationsDetails },
      { label: 'Other Issues', value: data.otherIssues, details: data.otherIssuesDetails },
  ];
  
  const photoFields = [
      'photoOdometer', 'photoVin', 'photoDriverFrontCorner', 'photoPassengerRearCorner', 'photoDriverQuarterPanel', 'photoPassengerQuarterPanel', 'photoDriverRearWheel', 'photoDashboard', 'photoFrontSeats', 'photoRearSeatArea', 'photoInteriorRoof', 'photoDriverFrontDoor', 'photoTrunkArea', 'photoDriverApron', 'photoPassengerApron',
  ];
  const damagePhotos = ['photoDamage1', 'photoDamage2', 'photoDamage3'];
  const featurePhotos = ['photoFeature1', 'photoFeature2', 'photoFeature3'];

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f2f2f2; }
          .container { max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 8px; padding: 32px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          h1, h2 { text-align: center; }
          h1 { color: #3366cc; font-size: 24px; }
          h2 { color: #333; font-size: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 8px; margin-top: 24px; }
          table { width: 100%; border-collapse: collapse; }
          ul { padding-left: 20px; }
          li { color: #333; font-size: 14px; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>New Appraisal Request</h1>
          <h2 style="text-align:center; border:none; margin-top:0; color:#555;">${vehicleTitle}</h2>
          
          <h2>Vehicle Information</h2>
          <table><tbody>${vehicleInfo.map(item => DataRow(item)).join('')}</tbody></table>

          <h2>Condition Report</h2>
          <table><tbody>
            ${conditionInfo.map(item => `
              ${DataRow({ label: item.label, value: item.value })}
              ${(item.value && item.value !== 'no' && item.details) ? `<tr><td colspan="2" style="padding-left: 16px;">${DescriptionRow({ label: 'Details', value: item.details })}</td></tr>` : ''}
            `).join('')}
          </tbody></table>
          
          <h2>Required Photos</h2>
          <p style="font-size: 14px; color: #555;">The following photos are included as attachments:</p>
          <ul>${photoFields.map(field => data[field] ? `<li>${toTitleCase(field)}</li>` : '').join('')}</ul>

          ${(damagePhotos.some(field => data[field])) ? `
            <h2>Damages</h2>
            <table><tbody>
              ${damagePhotos.map((field, index) => data[field] ? `
                <tr>
                  <td colspan="2" style="padding: 8px 0;">
                    <p style="font-size: 14px; color: #666; margin:0;">Damage ${index + 1} (Attached)</p>
                    ${DescriptionRow({ label: 'Description', value: data[`${field}Description`] })}
                  </td>
                </tr>
              ` : '').join('')}
            </tbody></table>
          ` : ''}

          ${(featurePhotos.some(field => data[field])) ? `
            <h2>Additional Features</h2>
            <table><tbody>
              ${featurePhotos.map((field, index) => data[field] ? `
                <tr>
                  <td colspan="2" style="padding: 8px 0;">
                    <p style="font-size: 14px; color: #666; margin:0;">Feature ${index + 1} (Attached)</p>
                    ${DescriptionRow({ label: 'Description', value: data[`${field}Description`] })}
                  </td>
                </tr>
              ` : '').join('')}
            </tbody></table>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
          
          <h2>Contact Information</h2>
          <table><tbody>${contactInfo.map(item => DataRow(item)).join('')}</tbody></table>
          
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 32px 0;" />
          
          <p style="text-align: center; color: #999; font-size: 12px;">This email was automatically generated by the Trade-In Vision application.</p>
        </div>
      </body>
    </html>
  `;
}

// No default export to avoid issues with edge/serverless environments
