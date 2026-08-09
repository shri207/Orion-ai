import { MetricsRegistry } from './MetricsRegistry';
import * as os from 'os';

export class PerformanceMonitor {
  constructor(private readonly registry: MetricsRegistry = MetricsRegistry.getInstance()) {}

  public recordSystemMetrics(): void {
    const cpus = os.cpus();
    this.registry.setGauge('system_cpu_cores', cpus.length, {}, 'Number of CPU cores');
    
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    this.registry.setGauge('system_memory_used_bytes', usedMem, {}, 'Used system memory in bytes');
    this.registry.setGauge('system_memory_total_bytes', totalMem, {}, 'Total system memory in bytes');
    
    const processMem = process.memoryUsage();
    this.registry.setGauge('process_memory_rss_bytes', processMem.rss, {}, 'Process RSS memory');
    this.registry.setGauge('process_memory_heap_used_bytes', processMem.heapUsed, {}, 'Process heap used');
  }
}
