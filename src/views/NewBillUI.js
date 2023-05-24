import VerticalLayout from "./VerticalLayout.js";
import euroIcon from "../assets/svg/euro.js";
import pctIcon from "../assets/svg/pct.js";

export default () => {
    return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Envoyer une note de frais </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="expense-type"  class="bold-label">Type de dépense</label>
                      <select required class="form-control blue-border" data-testid="expense-type">
                        <option value="Transports">Transports</option>
                        <option value="Restaurants et bars">Restaurants et bars</option>
                        <option value="Hôtel et logement">Hôtel et logement</option>
                        <option value="Services en ligne">Services en ligne</option>
                        <option value="IT et électronique">IT et électronique</option>
                        <option value="Equipement et matériel">Equipement et matériel</option>
                        <option value="Fournitures de bureau">Fournitures de bureau</option>
                      </select>
                  </div>
                  <div class="col-half">
                    <label for="expense-name" class="bold-label">Nom de la dépense</label>
                    <input id="expense-name" required type="text" class="form-control blue-border" data-testid="expense-name" placeholder="Vol Paris Londres" />
                  </div>
                  <div class="col-half">
                    <label for="datepicker" class="bold-label">Date</label>
                    <input id="datepicker" required type="date" class="form-control blue-border" data-testid="datepicker" />
                  </div>
                  <div class="col-half">
                    <label for="amount" class="bold-label">Montant TTC </label>
                    <input required type="number" min="0"
                    step="0.01" id="amount" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>
                  </div>
                  <div class="col-half">
                   
                      <label for="vat" class="bold-label">TVA</label>
                      <div class="d-flex flex-row align-items-center">
                        <input type="number"  min="0"
                        step="0.01" required class="form-control blue-border" data-testid="vat" placeholder="70" />
                        <span class="ml-1">${euroIcon} </span>
                      </div>
                    
                      <label for="pct" class="white-text">%</label>
                      <div class="d-flex flex-row align-items-center">
                      <input min="0"
                      step="0.01" required type="number" class="form-control blue-border" data-testid="pct" placeholder="20" />
                      <span class="ml-1">${pctIcon} </span>
                      </div>
                     
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="commentary" class="bold-label">Commentaire</label>
                    <textarea class="form-control blue-border" data-testid="commentary" rows="3"></textarea>
                  </div>
                  <div class="col-half">
                    <label for="file" class="bold-label">Justificatif</label>
                    <input required type="file" accept=".jpg,.jpeg,.png" class="form-control blue-border" data-testid="inputfile" id="file"/>
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' data-testid="btn-send-bill" class="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
};
