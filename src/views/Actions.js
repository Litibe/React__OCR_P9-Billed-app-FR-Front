import downloadBlueIcon from "../assets/svg/download_blue.js";
import eyeBlueIcon from "../assets/svg/eye_blue.js";

import downloadWhiteIcon from "../assets/svg/download_white.js";
import eyeWhiteIcon from "../assets/svg/eye_white.js";

export default (billUrl) => {
    if (billUrl === undefined || billUrl.includes("null")) {
        return `<div class="icon-actions">
        <div data-testid="icon-eye" data-bill-url="null">
        ${eyeWhiteIcon}
        </div>
       
        <div data-testid="icon-download" >
        ${downloadWhiteIcon}
        </div>
      </div>`;
    }
    const fileName = billUrl.split("?")[0];
    return `<div class="icon-actions">
          <div class='icon-eye' data-testid="icon-eye" data-bill-url=${billUrl}>
          ${eyeBlueIcon}
          </div>
        
          <a data-testid="icon-download" href=${billUrl} file=${fileName} download>
          ${downloadBlueIcon}
          </a>
      </div>
      `;
};
