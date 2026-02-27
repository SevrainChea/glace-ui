import type { Ref } from 'vue'
import type { TrackGlaceLightOptions } from '@glace-ui/core'

export type UseGlaceLightOptions = TrackGlaceLightOptions

export declare function useGlaceLight(
  elementRef: Ref<HTMLElement | null>,
  options?: UseGlaceLightOptions,
): void
