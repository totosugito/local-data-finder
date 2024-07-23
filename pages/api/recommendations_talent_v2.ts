import { NearTextType } from 'types';
import type { NextApiRequest, NextApiResponse } from 'next';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  try {
    const { method } = req;
    let { query, userInterests } = req.body;

    const weaviateClusterUrl = process.env.WEAVIATE_CLUSTER_URL?.replace("https://", "")

    switch (method) {

      case 'POST': {

        let headers: { [key: string]: string } = {};

        if (process.env.OPENAI_API_KEY) {
            headers['X-OpenAI-Api-Key'] = process.env.OPENAI_API_KEY;
        }

        if (process.env.COHERE_API_KEY) {
            headers['X-Cohere-Api-Key'] = process.env.COHERE_API_KEY;
        }

        const client: WeaviateClient = weaviate.client({
          scheme: 'http',
          host: weaviateClusterUrl,
          headers: headers,
        });

        let nearText: NearTextType = {
          concepts: [],
        }

        nearText.certainty = .6
        nearText.concepts = req.body['query'];
        let generatePrompt = req.body['userInterests'];
        let recDataBuilder = client.graphql
          .get()
          .withClassName('TalentV2')
          .withFields(
            'sex connections followers about experiences educations licenses skills projects publications courses languages interests name label summary email city countryCode image'
          )
          .withNearText(nearText)
          .withLimit(20);

        if (generatePrompt !== '') {
          if (headers['X-Cohere-Api-Key']) {
            recDataBuilder = recDataBuilder.withGenerate({
              singlePrompt: generatePrompt,
            });
          }
        }

      const recData = await recDataBuilder.do();

        res.status(200).json(recData);
        break;
      }
      default:
        res.status(400);
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}
