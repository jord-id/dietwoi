import type { CalculatorConfig } from '~/types/calculator'
import { CalculationError } from '~/composables/useCalculations'

/**
 * Composable that handles common calculator setup:
 * - Initializes inputs from config defaults
 * - Provides type-safe accessors
 * - Manages result + error state
 * - Sets up reactive calculation with error handling
 *
 * @param config - Calculator configuration with input definitions
 * @param calculateFn - Function that performs the calculation
 * @returns Reactive state and accessors for the calculator
 *
 * @example
 * const config: CalculatorConfig = { ... }
 * const { calculate } = useBmi()
 *
 * const { inputs, result, error, num, str } = useCalculatorSetup(
 *   config,
 *   (i) => calculate({ weight: i.weight as number, height: i.height as number })
 * )
 *
 * // Type-safe accessors
 * const weight = num('weight')
 * const gender = str('gender')
 */
export function useCalculatorSetup<TResult>(
  config: CalculatorConfig,
  calculateFn: (inputs: Record<string, number | string>) => TResult
) {
  // Initialize inputs from config defaults
  const inputs = ref<Record<string, number | string>>(
    Object.fromEntries(
      config.inputs.map((input) => [input.key, input.default])
    )
  )

  // Result and error state
  const result = ref<TResult | null>(null) as Ref<TResult | null>
  const error = ref<string | null>(null)

  // Type-safe accessor factories
  const num = (key: string) => computed(() => Number(inputs.value[key]))
  const str = (key: string) => computed(() => String(inputs.value[key]))

  // Calculate with error handling
  const calculate = () => {
    try {
      error.value = null
      result.value = calculateFn(inputs.value)
    } catch (e) {
      if (e instanceof CalculationError) {
        error.value = e.message
        result.value = null
      } else {
        throw e
      }
    }
  }

  // Auto-calculate on mount and input changes
  onMounted(calculate)
  watch(inputs, calculate, { deep: true })

  return {
    inputs,
    result,
    error,
    num,
    str,
    calculate,
  }
}
