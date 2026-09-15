# zyberon evidence

| Claim | Evidence | Confidence / boundary | Public wording |
| --- | --- | --- | --- |
| Built platform from scratch | Owner confirmation in this request; `zyberon-ai/zyberon-ai-platform.md` | Owner-provided contribution; the supplied document has different team attribution, so commit history is not independently established | I built Zyberon AI from scratch. |
| Meta campaign request and n8n handoff | `zyberon-ai/app/dashboard/meta-ads/actions.ts` (`createCampaignRequest`) | App-side implementation observed; downstream workflow runtime unverified | Authenticates, checks limits, sends pending campaign batch, and handles webhook failure. |
| Provider-event verification | `zyberon-ai/utils/shopify-webhook-utils.ts`; `zyberon-ai/app/api/stripe/webhook/route.ts` | Signature checks observed; production delivery unverified | Shopify and Stripe events have signature verification paths. |
| Platform scope | `zyberon-ai/zyberon-ai-platform.md`; module routes under `zyberon-ai/app/dashboard/` | Document and interface code support broad module scope; reported metrics lack measurement method | Modules share store context across commerce operations. |

The portfolio uses existing Zyberon brand artwork sourced from the official website. The supplied case-study document's percentages, timings, staffing figures, and production scale are omitted because measurement evidence was not supplied.
