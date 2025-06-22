<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SuccessResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $res = [];
        if(isset($this->resource['data'])) $res['data'] = $this->resource['data'];
        return $res;
    }

    public function withResponse(Request $request, $response): void
    {
        $response->setData(array_merge([
            'status' => true,
            'message' => $this->resource['message'] ?? 'An error occurred',
        ], $response->getData(true)));
    }
}
