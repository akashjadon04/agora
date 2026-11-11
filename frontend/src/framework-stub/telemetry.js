export const useTelemetry = () => ({
  capture: () => {},
  pageview: () => {},
  identify: () => {},
  track: () => {},
})
export const telemetryPlugin = {
  install: () => {},
}
export default { useTelemetry, telemetryPlugin }
